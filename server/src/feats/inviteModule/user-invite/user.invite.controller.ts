import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { userInviteService } from './index.js';

import { assertAuth, withTransaction } from '@/common/index.js';

/**
 * ----------------- Read Operations -----------------
 */
export const myInvites = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { invites, total } = await userInviteService.getUserInvites(userId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User invites fetched successfully',
    meta: { page, limit, total },
    data: { invites },
  });
};

/**
 * ----------------- Write Operations -----------------
 */
export const acceptInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { token } = req.params;

  const invite = await withTransaction(async session => {
    return await userInviteService.acceptInvite(userId, token, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invite accepted successfully',
    data: { invite },
  });
};

export const declineInvite = async (req: Request, res: Response) => {
  const { token } = req.params;

  const invite = await withTransaction(async session => {
    return await userInviteService.declineInvite(token, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invite declined successfully',
    data: { invite },
  });
};

export default {
  myInvites,
  acceptInvite,
  declineInvite,
};
