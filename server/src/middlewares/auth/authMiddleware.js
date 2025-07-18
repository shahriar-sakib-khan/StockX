import { Errors } from '../../error';
import { Tokens } from '@/utils/index.js';

/**
 * Authenticate User Middleware
 *
 * - Validates access token (cookie preferred, fallback header-ready).
 * - Attaches essential user data to req.user.
 */
export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) throw new Errors.UnauthenticatedError('Authentication token required');

  const { userId, superRole } = Tokens.verifyAccessToken(token);

  req.user = { userId, superRole };

  next();
};
