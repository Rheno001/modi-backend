import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAccessToken = (userId: string, role: string): string => {
    return jwt.sign(
        { userId, role },
        env.jwtAccessSecret,
        { expiresIn: env.jwtAccessExpiresIn || '15m' } as any
    );
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        env.jwtRefreshSecret,
        { expiresIn: env.jwtRefreshExpiresIn || '7d' } as any
    );
};

export const verifyAccessToken = (token: string): { userId: string; role: string } => {
    return jwt.verify(token, env.jwtAccessSecret) as { userId: string; role: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
    return jwt.verify(token, env.jwtRefreshSecret) as { userId: string };
};