/**
 * @module AuthController
 *
 * Contains controllers for handling authentication flows:
 * - User registration
 * - Login with token issuance
 * - Logout by clearing cookies
 * - Access token refreshing
 */
// <============================>  <============================>

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

import { authService } from '@/services/v1/index.js';
import { Tokens } from '@/utils/index.js';
import { assertAuth } from '@/common/assertions';

/**
 * @function register
 * @desc Registers a new user after validation, returns user data.
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.registerUser(req.body);
  res.status(StatusCodes.CREATED).json({
    message: 'User registered successfully',
    user,
  });
};

/**
 * @function login
 * @desc Authenticates user, issues access token and sets HTTP-only refresh token cookie.
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.loginUser(req.body);

  const accessToken = Tokens.createAccessToken({ userId: user._id, role: user.role });
  const refreshToken = Tokens.createRefreshToken({ userId: user._id });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRES_IN_MS)),
    sameSite: 'strict',
  });

  res.status(StatusCodes.OK).json({
    message: 'Login successful',
    user,
    accessToken,
  });
};

/**
 * @function logout
 * @desc Logs out user by clearing the refresh token cookie.
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = (req: Request, res: Response): void => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Unix epoch
    sameSite: 'strict',
    path: '/', // Important: clears root cookie
  });

  res.status(StatusCodes.OK).json({ message: 'User logged out' });
};

/**
 * @function refreshAccessToken
 * @desc Generates a new access token using a valid refresh token (user is pre-attached to request).
 * @route POST /api/v1/auth/refresh-token
 * @access Private
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const accessToken = await authService.refreshAccessToken(req.cookies.refreshToken);

  res.status(StatusCodes.OK).json({ accessToken });
};