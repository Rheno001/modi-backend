import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 'No token provided', 401);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return sendError(res, 'No token provided', 401);
        }
        const decoded = verifyAccessToken(token);
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (err) {
        return sendError(res, 'Invalid or expired token', 401);
    }
};
export const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return sendError(res, 'Access forbidden: Admin role required', 403);
    }
    next();
};
//# sourceMappingURL=auth.middleware.js.map