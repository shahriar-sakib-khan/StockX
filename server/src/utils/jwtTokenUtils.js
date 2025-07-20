import jwt from 'jsonwebtoken';
import { Errors } from '../error/index.js';

/**
 * Create an **Access Token** (short-lived, frequent usage)
 */
export const createAccessToken = payload => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

/**
 * Create a **Refresh Token** (long-lived, used for re-authentication)
 */
export const createRefreshToken = payload => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

/**
 * Verify **Access Token**
 */
export const verifyAccessToken = token => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, role } = decoded;
  if (!userId || !role) throw new Errors.UnauthorizedError('Invalid token');
  return { userId, role };
};

/**
 * Verify **Refresh Token**
 */
export const verifyRefreshToken = token => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const { userId } = decoded;
  if (!userId) throw new Errors.UnauthorizedError('Invalid refresh token');
  return { userId };
};
