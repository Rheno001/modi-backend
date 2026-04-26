import type { Response, NextFunction } from 'express';
import type { Request } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};