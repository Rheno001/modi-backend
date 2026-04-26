import { sendError } from '../utils/response.js';
export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return sendError(res, 'Not authenticated', 401);
    }
    if (req.user.role !== 'ADMIN') {
        return sendError(res, 'Access denied', 403);
    }
    next();
};
//# sourceMappingURL=role.middleware.js.map