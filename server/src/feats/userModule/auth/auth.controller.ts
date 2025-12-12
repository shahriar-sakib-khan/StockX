import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authService } from './index.js';

import { withTransaction } from '@/common/database.js';
import { Tokens } from '@/utils/index.js';

/**
 * ----------------- Write Operations -----------------
 */
export const register = async (req: Request, res: Response) => {
  // Transaction handles User Creation + Invite Updates
  const user = await withTransaction(async session => {
    return await authService.registerUser(req.body, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: { user },
  });
};

/**
 * ----------------- Read/Auth Operations -----------------
 */
export const login = async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body);

  const accessToken = Tokens.createAccessToken({ userId: user.id, role: user.role });
  const refreshToken = Tokens.createRefreshToken({ userId: user.id });

  // Set Refresh Token Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRES_IN_MS)),
    sameSite: 'strict',
    path: '/',
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    data: { user, accessToken },
  });
};

export const logout = (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Expire immediately
    sameSite: 'strict' as const,
    path: '/',
  };

  res.cookie('accessToken', '', cookieOptions);
  res.cookie('refreshToken', '', cookieOptions);

  authService.logoutUser();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User logged out successfully',
  });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Access token refreshed successfully',
    data: { accessToken },
  });
};

export default {
  register,
  login,
  logout,
  refreshAccessToken,
};
