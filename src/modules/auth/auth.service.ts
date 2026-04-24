import prisma from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';

export const registerUser = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existingUser) {
        throw new Error('An account with this email already exists');
    }

    const hashed = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            passwordHash: hashed,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
        }
    });

    return user;
};

export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const passwordMatch = await comparePassword(data.password, user.passwordHash);

    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt,
        }
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
    if (!token) {
        throw new Error('No refresh token provided');
    }

    const decoded = verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
        where: { token }
    });

    if (!storedToken) {
        throw new Error('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { token } });
        throw new Error('Refresh token has expired, please login again');
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
    });

    if (!user) {
        throw new Error('User no longer exists');
    }

    const newAccessToken = generateAccessToken(user.id, user.role);

    return { accessToken: newAccessToken };
};

export const logoutUser = async (token: string) => {
    if (!token) return;

    await prisma.refreshToken.deleteMany({
        where: { token }
    });
};