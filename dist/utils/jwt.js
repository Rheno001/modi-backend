import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export const generateAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn || '15m' });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn || '7d' });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwtAccessSecret);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.jwtRefreshSecret);
};
//# sourceMappingURL=jwt.js.map