import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { ENV } from '../config/env.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(
    res,
    message,
    ENV.NODE_ENV === 'development' ? { stack: err.stack, details: err } : undefined,
    statusCode
  );
};
