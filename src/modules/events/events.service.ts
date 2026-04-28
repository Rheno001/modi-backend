import { Prisma } from '@prisma/client';
import prisma from '../../config/db.js';

export const createEvent = async (
    userId: string,
    data: {
        title: string;
        description: string;
        category: string;
        bannerUrl?: string;
        venue: string;
        address: string;
        city: string;
        state: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        ticketTypes: {
            name: string;
            price: number;
            quantity: number;
            saleStart?: string;
            saleEnd?: string;
            perks?: string;
        }[];
    }
) => {
    const event = await prisma.event.create({
        data: {
            title: data.title,
            description: data.description,
            category: data.category,
            bannerUrl: data.bannerUrl ?? null,
            venue: data.venue,
            address: data.address,
            city: data.city,
            state: data.state,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            startTime: data.startTime,
            endTime: data.endTime,
            createdById: userId,
            ticketTypes: {
                create: data.ticketTypes.map((ticket) => ({
                    name: ticket.name,
                    price: ticket.price,
                    quantity: ticket.quantity,
                    saleStart: ticket.saleStart ? new Date(ticket.saleStart) : null,
                    saleEnd: ticket.saleEnd ? new Date(ticket.saleEnd) : null,
                    perks: ticket.perks ?? null,
                }))
            }
        },
        include: {
            ticketTypes: true,
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });

    return event;
};

export const getAllEvents = async (filters: {
    city?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const where: Prisma.EventWhereInput = {
        status: 'PUBLISHED',
        endDate: { gte: now },
        ...(filters.city && { city: { contains: filters.city, mode: 'insensitive' } }),
        ...(filters.category && { category: { contains: filters.category, mode: 'insensitive' } }),
        ...(filters.search && {
            OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { venue: { contains: filters.search, mode: 'insensitive' } },
            ]
        }),
    };

    const [events, total] = await prisma.$transaction([
        prisma.event.findMany({
            where,
            skip,
            take: limit,
            orderBy: { startDate: 'asc' },
            include: {
                ticketTypes: true,
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        }),
        prisma.event.count({ where })
    ]);

    return {
        events,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        }
    };
};

export const getEventById = async (eventId: string, userId?: string, role?: string) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            ticketTypes: true,
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    // Allow the owner or an admin to see a draft/cancelled event
    if (event.status !== 'PUBLISHED' && event.createdById !== userId && role !== 'ADMIN') {
        throw new Error('Event not found');
    }

    return event;
};

export const getMyEvents = async (userId: string) => {
    const events = await prisma.event.findMany({
        where: { createdById: userId },
        orderBy: { createdAt: 'desc' },
        include: {
            ticketTypes: true,
        }
    });

    return events;
};

export const getEventAttendees = async (
    eventId: string,
    userId: string,
    role: string
) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.createdById !== userId && role !== 'ADMIN') {
        throw new Error('You are not authorized to view attendees for this event');
    }

    const orders = await prisma.order.findMany({
        where: {
            eventId,
            status: 'COMPLETED'
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    avatar: true,
                }
            },
            orderItems: {
                include: {
                    ticketType: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return orders;
};

export const getEventAnalytics = async (
    eventId: string,
    userId: string,
    role: string
) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.createdById !== userId && role !== 'ADMIN') {
        throw new Error('You are not authorized to view analytics for this event');
    }

    const completedOrders = await prisma.order.findMany({
        where: {
            eventId,
            status: 'COMPLETED'
        },
        select: {
            totalAmount: true,
            organizerPayout: true,
            userId: true,
            orderItems: {
                select: {
                    quantity: true
                }
            }
        }
    });

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalPayout = completedOrders.reduce((sum, order) => sum + order.organizerPayout, 0);
    const totalTicketsSold = completedOrders.reduce(
        (sum, order) => sum + order.orderItems.reduce((iSum, item) => iSum + item.quantity, 0),
        0
    );
    const uniqueAttendees = new Set(completedOrders.map((o) => o.userId)).size;

    return {
        totalRevenue,
        totalPayout,
        totalTicketsSold,
        uniqueAttendees,
        orderCount: completedOrders.length
    };
};

export const updateEvent = async (
    eventId: string,
    userId: string,
    role: string,
    data: Partial<{
        title: string;
        description: string;
        category: string;
        bannerUrl: string | null;
        venue: string;
        address: string;
        city: string;
        state: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
        isFeatured: boolean;
        ticketTypes: any;
    }>
) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.createdById !== userId && role !== 'ADMIN') {
        throw new Error('You are not authorized to edit this event');
    }

    if (event.status === 'CANCELLED' || event.status === 'COMPLETED') {
        throw new Error(`Cannot edit a ${event.status.toLowerCase()} event`);
    }

    const { ticketTypes, startDate, endDate, ...eventData } = data;

    const updateData: Prisma.EventUpdateInput = {
        ...eventData as any,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
    };

    // If ticketTypes are provided, we replace them
    if (ticketTypes && Array.isArray(ticketTypes)) {
        updateData.ticketTypes = {
            deleteMany: {},
            create: ticketTypes.map((ticket: any) => ({
                name: ticket.name,
                price: ticket.price,
                quantity: ticket.quantity,
                saleStart: ticket.saleStart ? new Date(ticket.saleStart) : null,
                saleEnd: ticket.saleEnd ? new Date(ticket.saleEnd) : null,
                perks: ticket.perks ?? null,
            }))
        };
    }

    const updated = await prisma.event.update({
        where: { id: eventId },
        data: updateData,
        include: {
            ticketTypes: true,
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });

    return updated;
};

export const cancelEvent = async (
    eventId: string,
    userId: string,
    role: string
) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.createdById !== userId && role !== 'ADMIN') {
        throw new Error('You are not authorized to cancel this event');
    }

    if (event.status === 'CANCELLED') {
        throw new Error('Event is already cancelled');
    }

    if (event.status === 'DRAFT') {
        await prisma.event.delete({
            where: { id: eventId }
        });
        return { deleted: true };
    }

    const updated = await prisma.event.update({
        where: { id: eventId },
        data: { status: 'CANCELLED' }
    });

    return { ...updated, deleted: false };
};

export const publishEvent = async (
    eventId: string,
    userId: string,
    role: string
) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { ticketTypes: true }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.createdById !== userId && role !== 'ADMIN') {
        throw new Error('You are not authorized to publish this event');
    }

    if (event.status === 'CANCELLED') {
        throw new Error('Cannot publish a cancelled event');
    }

    if (event.status === 'PUBLISHED') {
        throw new Error('Event is already published');
    }

    if (event.ticketTypes.length === 0) {
        throw new Error('Cannot publish an event with no ticket types');
    }

    const updated = await prisma.event.update({
        where: { id: eventId },
        data: { status: 'PUBLISHED' }
    });

    return updated;
};

export const adminGetAllEvents = async () => {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            ticketTypes: true,
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });

    return events;
};