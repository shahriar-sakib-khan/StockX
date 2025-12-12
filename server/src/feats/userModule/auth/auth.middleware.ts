import { Request, Response, NextFunction } from 'express';

import { assertAuth } from '@/common/index.js';
import { Errors } from '@/error/index.js';
import { Tokens } from '@/utils/index.js';

/**
 * Middleware to authenticate user from JWT.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    throw new Errors.UnauthenticatedError('Authentication token required');
  }

  const { userId, role } = Tokens.verifyAccessToken(accessToken);

  req.user = { userId, role };

  assertAuth(req);

  next();
};

/**
 * Middleware to authorize based on Global Roles.
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    assertAuth(req);
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      throw new Errors.ForbiddenError('Access denied: Insufficient global privileges');
    }
    next();
  };
};
