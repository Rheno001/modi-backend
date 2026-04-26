import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware.js';
import { sendError } from '../utils/response.js';

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return sendError(res, 'Not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Access denied', 403);
  }

  next();
};