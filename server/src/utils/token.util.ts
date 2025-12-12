import crypto from 'crypto';

import jwt, { type SignOptions, type JwtPayload } from 'jsonwebtoken';

import { Errors } from '@/error/index.js';

//=============================================
// Types
//=============================================
export interface AccessTokenPayload {
  userId: string;
  role: string;
  storeId?: string; // Optional for Global Users, Required for Staff
  type?: 'user' | 'staff'; // Discriminator
}

export interface RefreshTokenPayload {
  userId: string;
  type?: 'user' | 'staff';
}

//=============================================
// Helper to enforce process.env safety
//=============================================
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

//=============================================
// GLOBAL USER TOKENS (Owners/Admins)
//=============================================
export const createAccessToken = (payload: AccessTokenPayload): string => {
  const secret = getEnvVar('JWT_ACCESS_SECRET');
  const expiresIn = getEnvVar('JWT_ACCESS_EXPIRES_IN');

  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: 'HS256',
  } as SignOptions); // <--- CAST FIXED THE ERROR
};

export const createRefreshToken = (payload: RefreshTokenPayload): string => {
  const secret = getEnvVar('JWT_REFRESH_SECRET');
  const expiresIn = getEnvVar('JWT_REFRESH_EXPIRES_IN');

  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: 'HS256',
  } as SignOptions); // <--- CAST FIXED THE ERROR
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const secret = getEnvVar('JWT_ACCESS_SECRET');

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const { userId, role } = decoded;
    if (!userId || !role) {
      throw new Errors.UnauthenticatedError('Invalid access token structure');
    }

    return { userId, role, type: 'user' };
  } catch (error) {
    throw new Errors.UnauthenticatedError('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const secret = getEnvVar('JWT_REFRESH_SECRET');

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const { userId } = decoded;
    if (!userId) {
      throw new Errors.UnauthenticatedError('Invalid refresh token structure');
    }

    return { userId, type: 'user' };
  } catch (error) {
    throw new Errors.UnauthenticatedError('Invalid or expired refresh token');
  }
};

//=============================================
// STAFF TOKENS (Local Access)
//=============================================
export const createStaffAccessToken = (payload: AccessTokenPayload): string => {
  const secret = getEnvVar('JWT_STAFF_ACCESS_SECRET');

  // Staff tokens have shorter, fixed expiration (e.g., 12h shift)
  return jwt.sign({ ...payload, type: 'staff' }, secret, {
    expiresIn: '12h',
    algorithm: 'HS256',
  } as SignOptions); // <--- CAST FIXED THE ERROR
};

export const verifyStaffAccessToken = (token: string): AccessTokenPayload => {
  const secret = getEnvVar('JWT_STAFF_ACCESS_SECRET');

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Strict check for Staff type to prevent token reuse across scopes
    if (!decoded.userId || decoded.type !== 'staff') {
      throw new Errors.UnauthenticatedError('Invalid token scope');
    }

    return {
      userId: decoded.userId,
      role: decoded.role,
      storeId: decoded.storeId,
      type: 'staff',
    };
  } catch (error) {
    throw new Errors.UnauthenticatedError('Invalid or expired staff token');
  }
};

//=============================================
// Generate Secure Random Token
//=============================================
export const generateCryptoToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export default {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createStaffAccessToken,
  verifyStaffAccessToken,
  generateCryptoToken,
};
