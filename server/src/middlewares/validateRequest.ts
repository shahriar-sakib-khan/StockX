import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

/**
 * Validates request body against the provided Zod schema.
 * Returns an Express middleware.
 */
export const validateRequest = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Pass the ZodError to the global error handler
      // This allows consistent error formatting across the app
      return next(result.error);
    }

    // Attach sanitized data to req.body
    req.body = result.data;
    next();
  };
};
