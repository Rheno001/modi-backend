import { sendError } from '../utils/response.js';
export const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    return sendError(res, err.message || 'Something went wrong', 500);
};
//# sourceMappingURL=error.middleware.js.map