export declare const initiateOrder: (attendee: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}, data: {
    eventId: string;
    items: {
        ticketTypeId: string;
        quantity: number;
    }[];
}) => Promise<{
    order: {
        orderItems: ({
            ticketType: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                eventId: string;
                price: number;
                quantity: number;
                quantitySold: number;
                saleStart: Date | null;
                saleEnd: Date | null;
                perks: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            quantity: number;
            ticketTypeId: string;
            unitPrice: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        eventId: string;
        reference: string;
        totalAmount: number;
        platformFee: number;
        organizerPayout: number;
    };
    paymentUrl: any;
    accessCode: any;
    reference: string;
}>;
export declare const verifyOrder: (reference: string) => Promise<{
    order: ({
        user: {
            role: import("@prisma/client").$Enums.Role;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        event: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            category: string;
            bannerUrl: string | null;
            venue: string;
            address: string;
            city: string;
            state: string;
            startDate: Date;
            endDate: Date;
            startTime: string;
            endTime: string;
            status: import("@prisma/client").$Enums.EventStatus;
            isFeatured: boolean;
            createdById: string;
        };
        orderItems: ({
            ticketType: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                eventId: string;
                price: number;
                quantity: number;
                quantitySold: number;
                saleStart: Date | null;
                saleEnd: Date | null;
                perks: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            orderId: string;
            quantity: number;
            ticketTypeId: string;
            unitPrice: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        eventId: string;
        reference: string;
        totalAmount: number;
        platformFee: number;
        organizerPayout: number;
    }) | null;
    tickets: any[];
}>;
export declare const getMyOrders: (userId: string) => Promise<({
    event: {
        id: string;
        title: string;
        bannerUrl: string | null;
        venue: string;
        city: string;
        startDate: Date;
        startTime: string;
    };
    tickets: {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TicketStatus;
        eventId: string;
        orderId: string;
        orderItemId: string;
        uniqueCode: string;
        qrUrl: string | null;
    }[];
    orderItems: ({
        ticketType: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            price: number;
            quantity: number;
            quantitySold: number;
            saleStart: Date | null;
            saleEnd: Date | null;
            perks: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        orderId: string;
        quantity: number;
        ticketTypeId: string;
        unitPrice: number;
    })[];
} & {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.OrderStatus;
    eventId: string;
    reference: string;
    totalAmount: number;
    platformFee: number;
    organizerPayout: number;
})[]>;
export declare const getMyTickets: (userId: string) => Promise<({
    order: {
        event: {
            id: string;
            title: string;
            bannerUrl: string | null;
            venue: string;
            city: string;
            state: string;
            startDate: Date;
            startTime: string;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        eventId: string;
        reference: string;
        totalAmount: number;
        platformFee: number;
        organizerPayout: number;
    };
    orderItem: {
        ticketType: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            price: number;
            quantity: number;
            quantitySold: number;
            saleStart: Date | null;
            saleEnd: Date | null;
            perks: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        orderId: string;
        quantity: number;
        ticketTypeId: string;
        unitPrice: number;
    };
} & {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.TicketStatus;
    eventId: string;
    orderId: string;
    orderItemId: string;
    uniqueCode: string;
    qrUrl: string | null;
})[]>;
export declare const scanTicket: (uniqueCode: string, scannedById: string) => Promise<{
    order: {
        event: {
            id: string;
            title: string;
            startDate: Date;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        eventId: string;
        reference: string;
        totalAmount: number;
        platformFee: number;
        organizerPayout: number;
    };
    orderItem: {
        ticketType: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            price: number;
            quantity: number;
            quantitySold: number;
            saleStart: Date | null;
            saleEnd: Date | null;
            perks: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        orderId: string;
        quantity: number;
        ticketTypeId: string;
        unitPrice: number;
    };
} & {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.TicketStatus;
    eventId: string;
    orderId: string;
    orderItemId: string;
    uniqueCode: string;
    qrUrl: string | null;
}>;
export declare const handleWebhook: (payload: any) => Promise<void>;
//# sourceMappingURL=orders.service.d.ts.map