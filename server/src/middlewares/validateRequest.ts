import { ZodType } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const validateRequest = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation failed',
        errors,
      });
    }
    req.body = result.data;
    next();
  };
};

export default validateRequest;
