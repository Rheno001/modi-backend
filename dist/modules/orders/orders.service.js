import prisma from '../../config/db.js';
import { initializePayment, verifyPayment } from '../../utils/paystack.js';
import { generateUniqueCode, generateQRCode } from '../../utils/ticket.js';
import { env } from '../../config/env.js';
import crypto from 'crypto';
import { sendTicketConfirmationEmail } from '../../utils/email.js';
export const initiateOrder = async (attendee, data) => {
    // 1. Fetch the event and verify it's published
    const event = await prisma.event.findUnique({
        where: { id: data.eventId },
        include: { ticketTypes: true },
    });
    if (!event)
        throw new Error('Event not found');
    if (event.status !== 'PUBLISHED')
        throw new Error('Event is not available for booking');
    // 2. Find or create a guest user account using their email
    // If they already have an account, use it
    // If not, create a guest account silently
    let user = await prisma.user.findUnique({
        where: { email: attendee.email.toLowerCase() },
    });
    if (!user) {
        // Create a guest account with a random password
        // They can later claim this account by signing up with the same email
        const { hashPassword } = await import('../../utils/hash.js');
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await hashPassword(randomPassword);
        user = await prisma.user.create({
            data: {
                email: attendee.email.toLowerCase(),
                firstName: attendee.firstName,
                lastName: attendee.lastName,
                passwordHash: hashedPassword,
                phone: attendee.phone ?? null,
                role: 'USER',
                isVerified: false,
            },
        });
    }
    // 3. Validate each ticket type and check availability
    let totalAmount = 0;
    const validatedItems = [];
    for (const item of data.items) {
        const ticketType = event.ticketTypes.find(t => t.id === item.ticketTypeId);
        if (!ticketType) {
            throw new Error('Ticket type not found');
        }
        const available = ticketType.quantity - ticketType.quantitySold;
        if (item.quantity > available) {
            throw new Error(`Only ${available} ticket(s) remaining for ${ticketType.name}`);
        }
        if (item.quantity < 1) {
            throw new Error('Quantity must be at least 1');
        }
        totalAmount += ticketType.price * item.quantity;
        validatedItems.push({
            ticketTypeId: ticketType.id,
            quantity: item.quantity,
            unitPrice: ticketType.price,
            name: ticketType.name,
        });
    }
    // 4. Calculate fees
    const platformFee = totalAmount * (env.platformFeePercent / 100);
    const organizerPayout = totalAmount - platformFee;
    // 5. Generate a unique payment reference
    const reference = `MODI-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    // 6. Create the pending order
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            eventId: data.eventId,
            reference,
            totalAmount,
            platformFee,
            organizerPayout,
            status: 'PENDING',
            orderItems: {
                create: validatedItems.map(item => ({
                    ticketTypeId: item.ticketTypeId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })),
            },
        },
        include: {
            orderItems: {
                include: { ticketType: true },
            },
        },
    });
    // 7. Initialize payment with Paystack
    const paymentData = await initializePayment({
        email: user.email,
        amount: totalAmount,
        reference,
        metadata: {
            orderId: order.id,
            userId: user.id,
            eventId: data.eventId,
            eventTitle: event.title,
        },
    });
    return {
        order,
        paymentUrl: paymentData.authorization_url,
        accessCode: paymentData.access_code,
        reference,
    };
};
export const verifyOrder = async (reference) => {
    // 1. Find the order
    const order = await prisma.order.findUnique({
        where: { reference },
        include: {
            orderItems: {
                include: { ticketType: true },
            },
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                },
            },
            event: true,
        },
    });
    if (!order)
        throw new Error('Order not found');
    // 2. If already completed, return it as is
    if (order.status === 'COMPLETED') {
        const tickets = await prisma.ticket.findMany({
            where: { orderId: order.id },
        });
        return { order, tickets };
    }
    // 3. Verify with Paystack
    const paystackData = await verifyPayment(reference);
    if (paystackData.status !== 'success') {
        await prisma.order.update({
            where: { reference },
            data: { status: 'FAILED' },
        });
        throw new Error('Payment was not successful');
    }
    // 4. Use a transaction to update everything atomically
    const result = await prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
            where: { reference },
            data: { status: 'COMPLETED' },
        });
        const updatedOrder = await tx.order.findUnique({
            where: { reference },
            include: {
                orderItems: {
                    include: { ticketType: true },
                },
            },
        });
        if (!updatedOrder)
            throw new Error('Order not found during transaction');
        const createdTickets = [];
        // For each order item, generate tickets and update quantity sold
        for (const item of updatedOrder.orderItems) {
            // Atomically increment quantitySold — prevents overselling
            await tx.ticketType.update({
                where: { id: item.ticketTypeId },
                data: {
                    quantitySold: {
                        increment: item.quantity,
                    },
                },
            });
            // Generate one ticket per seat
            for (let i = 0; i < item.quantity; i++) {
                const uniqueCode = generateUniqueCode();
                const qrUrl = await generateQRCode(uniqueCode);
                const ticket = await tx.ticket.create({
                    data: {
                        orderId: order.id,
                        orderItemId: item.id,
                        userId: order.userId,
                        eventId: order.eventId,
                        uniqueCode,
                        qrUrl,
                        status: 'VALID',
                    },
                });
                createdTickets.push(ticket);
            }
        }
        // 3. Finally, fetch the fully updated order with fresh stats and secure user object
        const finalOrder = await tx.order.findUnique({
            where: { reference },
            include: {
                orderItems: {
                    include: { ticketType: true },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
                event: true,
            },
        });
        return { order: finalOrder, tickets: createdTickets };
    });
    // Send ticket confirmation email (fire-and-forget — never blocks the response)
    if (result.order?.user) {
        const { user, event } = result.order;
        sendTicketConfirmationEmail({
            to: user.email,
            firstName: user.firstName,
            eventTitle: event.title,
            eventDate: event.startDate.toISOString(),
            eventTime: event.startTime,
            eventVenue: event.venue,
            eventCity: event.city,
            tickets: result.tickets.map((t) => ({
                uniqueCode: t.uniqueCode,
                qrUrl: t.qrUrl ?? null,
                // ticketTypeName comes from the orderItem included in createdTickets
                ticketTypeName: t.orderItem?.ticketType?.name ?? 'Ticket',
            })),
        }).catch((err) => {
            console.error('[Email] Unexpected error in fire-and-forget email:', err);
        });
    }
    return result;
};
export const getMyOrders = async (userId) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            event: {
                select: {
                    id: true,
                    title: true,
                    bannerUrl: true,
                    startDate: true,
                    startTime: true,
                    venue: true,
                    city: true,
                },
            },
            orderItems: {
                include: { ticketType: true },
            },
            tickets: true,
        },
    });
    return orders;
};
export const getMyTickets = async (userId) => {
    const tickets = await prisma.ticket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            order: {
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            bannerUrl: true,
                            startDate: true,
                            startTime: true,
                            venue: true,
                            city: true,
                            state: true,
                        },
                    },
                },
            },
            orderItem: {
                include: { ticketType: true },
            },
        },
    });
    return tickets;
};
export const scanTicket = async (uniqueCode, scannedById) => {
    const ticket = await prisma.ticket.findUnique({
        where: { uniqueCode },
        include: {
            order: {
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            startDate: true,
                        },
                    },
                },
            },
            orderItem: {
                include: { ticketType: true },
            },
        },
    });
    if (!ticket) {
        throw new Error('INVALID_TICKET');
    }
    if (ticket.status === 'USED') {
        throw new Error('ALREADY_USED');
    }
    if (ticket.status === 'CANCELLED') {
        throw new Error('TICKET_CANCELLED');
    }
    await prisma.ticket.update({
        where: { uniqueCode },
        data: { status: 'USED' },
    });
    return ticket;
};
export const handleWebhook = async (payload) => {
    if (payload.event !== 'charge.success')
        return;
    const reference = payload.data?.reference;
    if (!reference)
        return;
    const order = await prisma.order.findUnique({
        where: { reference },
    });
    if (!order || order.status === 'COMPLETED')
        return;
    await verifyOrder(reference);
};
//# sourceMappingURL=orders.service.js.map