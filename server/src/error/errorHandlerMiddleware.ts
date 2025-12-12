import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { Errors } from '@/error/index.js';
import { logger } from '@/utils/index.js';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): Response => {
  // 1. Log the error using Winston
  // We log before checking the error type so we capture EVERYTHING.
  // We pass the error object directly so the 'format.errors({ stack: true })' can do its job.

  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(`Unknown Error: ${String(err)}`);
  }

  // 2. Handle Zod Errors (Validation)
  if (err instanceof ZodError) {
    const errors = err.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    // Optional: Log validation failures as 'warn' instead of 'error' to reduce noise?
    // logger.warn(`Validation failed for ${req.path}`);

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors,
      errorType: 'ValidationError',
    });
  }

  // 3. Handle Custom App Errors
  if (err instanceof Errors.BaseError) {
    // These are known/expected errors (e.g. 404 Not Found), so we might want
    // to log them as 'warn' to separate them from system crashes.
    // logger.warn(err.message);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      errorType: err.name,
      code: err.code,
    });
  }

  // 4. Handle Unexpected System Errors
  const genericMessage = 'Something went wrong, please try again later.';
  const errorType = (err as Error)?.name || 'InternalServerError';
  const stack = (err as Error)?.stack;

  // In production, we hide the stack trace from the client,
  // BUT we have already logged it to 'logs/app.log' above!
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? genericMessage : (err as Error)?.message,
    errorType,
    stack: process.env.NODE_ENV === 'production' ? undefined : stack,
  });
};

export default errorHandler;
