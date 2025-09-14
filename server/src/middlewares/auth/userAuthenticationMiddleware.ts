import { Request, Response, NextFunction } from 'express';

import { Errors } from '@/error/index.js';
import { Tokens } from '@/utils/index.js';
import { assertAuth } from '@/common/index.js';

/**
 * Middleware to authenticate user from JWT access token (cookie or header).
 * Adds decoded user info to req.user and ensures type safety.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    throw new Errors.UnauthenticatedError('Authentication token required');
  }

  const { userId, role } = Tokens.verifyAccessToken(accessToken);

  req.user = { userId, role };

  // Type assertion to narrow req.user
  assertAuth(req);

  next();
};
