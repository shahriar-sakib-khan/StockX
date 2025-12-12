import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { inviteService } from './index.js';

import { assertAuth, withTransaction } from '@/common/index.js';

/**
 * ----------------- Write Operations -----------------
 */
export const sendInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const invite = await withTransaction(async session => {
    return await inviteService.createInvite(req.body, userId, storeId, session);
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Invite sent successfully',
    data: { invite },
  });
};

export const deleteInvite = async (req: Request, res: Response) => {
  const { inviteId } = req.params;

  const invite = await withTransaction(async session => {
    return await inviteService.deleteInvite(inviteId, session);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invite deleted successfully',
    data: { invite },
  });
};

/**
 * ----------------- Read Operations -----------------
 */
export const allInvites = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { invites, total } = await inviteService.getAllInvites(storeId, page, limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invites fetched successfully',
    meta: { page, limit, total },
    data: { invites },
  });
};

export const singleInvite = async (req: Request, res: Response) => {
  const { inviteId } = req.params;
  const invite = await inviteService.getSingleInvite(inviteId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Invite fetched successfully',
    data: { invite },
  });
};

export default {
  sendInvite,
  allInvites,
  singleInvite,
  deleteInvite,
};
