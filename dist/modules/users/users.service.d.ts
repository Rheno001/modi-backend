export declare const getAllUsers: () => Promise<{
    role: import("@prisma/client").$Enums.Role;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    avatar: string | null;
    phone: string | null;
    createdAt: Date;
}[]>;
export declare const deleteUser: (userId: string) => Promise<{
    role: import("@prisma/client").$Enums.Role;
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    avatar: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=users.service.d.ts.map