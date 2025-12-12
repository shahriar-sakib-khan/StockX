import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { membershipService } from './index.js';

import { assertAuth } from '@/common/index.js';

/**
 * ----------------- Read Operations -----------------
 */
export const myStoreProfile = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const profile = await membershipService.getMyStoreProfile(userId, storeId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Store profile fetched successfully',
    data: { profile },
  });
};

export default {
  myStoreProfile,
};
