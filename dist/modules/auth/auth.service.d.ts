export declare const registerUser: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) => Promise<{
    role: import("@prisma/client").$Enums.Role;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    createdAt: Date;
}>;
export declare const loginUser: (data: {
    email: string;
    password: string;
}) => Promise<{
    user: {
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isVerified: boolean;
        avatar: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refreshAccessToken: (token: string) => Promise<{
    accessToken: string;
}>;
export declare const logoutUser: (token: string) => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map