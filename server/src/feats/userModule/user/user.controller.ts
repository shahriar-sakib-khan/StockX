import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { userService } from './index.js';

import { assertAuth, withTransaction } from '@/common/index.js';

/**
 * ----------------- Read Operations -----------------
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const user = await userService.getCurrentUser(userId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User fetched successfully',
    data: { user },
  });
};

/**
 * ----------------- Write Operations -----------------
 */
export const updateUser = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const updatedUser = await withTransaction(async session => {
    return await userService.updateUser(userId, req.body, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: { updatedUser },
  });
};

export default {
  getCurrentUser,
  updateUser,
};
