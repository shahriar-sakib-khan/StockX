import { Request, Response, NextFunction } from 'express';

import { Errors } from '../../error';
import { Tokens } from '@/utils/index.js';
import { assertAuth } from '@/common/assertions';

/**
 * Middleware to authenticate a user.
 *
 * - Validates the access token from cookies or Authorization header,
 * - verifies it, and attaches user info to req.user.
 * - Extracts essential user data (`userId`, `superRole`) from the token payload.
 * - Attaches this user data to `req.user` for downstream middleware/controllers.
 * - Uses assertAuth to guarantee type safety downstream.
 *
 * @function authenticateUser
 * @param Request - Express Request object
 * @param Response - Express Response object
 * @param NextFunction - Express Next function
 * @throws {UnauthenticatedError} If no token is provided or token verification fails
 *
 * @example
 * Use in route protection:
 * app.get('/protected', authenticateUser, (req, res) => {
 *   res.send(`Hello user ${req.user.userId} with role ${req.user.superRole}`);
 * });
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!accessToken) throw new Errors.UnauthenticatedError('Authentication token required');

  const { userId, role } = Tokens.verifyAccessToken(accessToken);

  req.user = {
    userId,
    role,
  };

  // Assert user presence & narrow type
  assertAuth(req);

  next();
};
