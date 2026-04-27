import prisma from '../../config/db.js';

export const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isVerified: true,
            avatar: true,
            phone: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const deleteUser = async (userId: string) => {
    return prisma.user.delete({
        where: { id: userId },
    });
};
