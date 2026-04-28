export declare const createEvent: (userId: string, data: {
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
}) => Promise<{
    createdBy: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    ticketTypes: {
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
    }[];
} & {
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
}>;
export declare const getAllEvents: (filters: {
    city?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}) => Promise<{
    events: ({
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        ticketTypes: {
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
        }[];
    } & {
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
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}>;
export declare const getEventById: (eventId: string, userId?: string, role?: string) => Promise<{
    createdBy: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    ticketTypes: {
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
    }[];
} & {
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
}>;
export declare const getMyEvents: (userId: string) => Promise<({
    ticketTypes: {
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
    }[];
} & {
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
})[]>;
export declare const getEventAttendees: (eventId: string, userId: string, role: string) => Promise<({
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        phone: string | null;
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
    isGuest: boolean;
})[]>;
export declare const getEventAnalytics: (eventId: string, userId: string, role: string) => Promise<{
    totalRevenue: number;
    totalPayout: number;
    totalTicketsSold: number;
    uniqueAttendees: number;
    orderCount: number;
}>;
export declare const updateEvent: (eventId: string, userId: string, role: string, data: Partial<{
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
    status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
    isFeatured: boolean;
    ticketTypes: any;
}>) => Promise<{
    createdBy: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    ticketTypes: {
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
    }[];
} & {
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
}>;
export declare const cancelEvent: (eventId: string, userId: string, role: string) => Promise<{
    deleted: boolean;
} | {
    deleted: boolean;
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
}>;
export declare const publishEvent: (eventId: string, userId: string, role: string) => Promise<{
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
}>;
export declare const adminGetAllEvents: () => Promise<({
    createdBy: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    ticketTypes: {
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
    }[];
} & {
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
})[]>;
//# sourceMappingURL=events.service.d.ts.map