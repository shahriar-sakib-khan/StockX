/**
 * @module AuthController
 *
 * @description Controller for authentication related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Tokens } from '@/utils/index.js';

import { authService } from './index.js';

/**
 * ----------------- Authentication Controllers -----------------
 */

export const register = async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);

  res.status(StatusCodes.CREATED).json({ message: 'User registered successfully', user });
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body);

  const accessToken = Tokens.createAccessToken({ userId: user.id, role: user.role });
  const refreshToken = Tokens.createRefreshToken({ userId: user.id });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRES_IN_MS)),
    sameSite: 'strict',
    path: '/',
  });

  res.status(StatusCodes.OK).json({ message: 'Login successful', user, accessToken });
};

export const logout = (req: Request, res: Response) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/',
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/',
  });

  res.status(StatusCodes.OK).json({ message: 'User logged out successfully' });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.status(StatusCodes.OK).json({ accessToken });
};

/**
 * ----------------- Default Exports (authController) -----------------
 */
export default {
  register,
  login,
  logout,
  refreshAccessToken,
};
