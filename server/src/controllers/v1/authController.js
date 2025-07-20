import { StatusCodes } from 'http-status-codes';

import { authService } from '@/services/v1/index.js';
import { Tokens } from '@/utils/index.js';

/**
 * Register Controller
 */
export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(StatusCodes.CREATED).json({ message: 'User registered successfully', user });
};

/**
 * Login Controller
 */
export const login = async (req, res) => {
  const user = await authService.loginUser(req.body);

  const accessToken = Tokens.createAccessToken({ userId: user._id, role: user.role });
  const refreshToken = Tokens.createRefreshToken({ userId: user._id });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRES_IN),
    sameSite: 'Strict',
  });

  res.status(StatusCodes.OK).json({
    message: 'Login successful',
    user,
    accessToken,
  });
};

/**
 * Logout Controller
 * Clears refresh token cookie and sends logout confirmation.
 */
export const logout = (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Unix epoch
    sameSite: "Strict",
    path: "/", // Ensure cookie is cleared on the root path
  });

  res.status(StatusCodes.OK).json({ message: "User logged out" });
};

/**
 * Access-Token Refresher Controller
 */
export const refreshAccessToken = async (req, res) => {
  // req.user is set in validateRefreshToken middleware after verifying refresh token
  const { userId, roles } = req.user;

  // Create new short-lived access token
  const accessToken = Tokens.createAccessToken({ userId, roles });

  res.status(StatusCodes.OK).json({ accessToken });
};
