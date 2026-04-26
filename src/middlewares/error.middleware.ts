import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);

  return sendError(
    res,
    err.message || 'Something went wrong',
    500
  );
};