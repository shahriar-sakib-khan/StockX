/**
 * @module UserInviteController
 *
 * @description Controller for user invite related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { userInviteService } from './index.js';

/**
 * ----------------- User Invite Controllers -----------------
 */

export const myInvites = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { invites, total } = await userInviteService.getUserInvites(userId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, invites });
};

export const acceptInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { token } = req.params;

  const invite = await userInviteService.acceptInvite(userId, token);

  res.status(StatusCodes.OK).json({ message: 'Invite accepted successfully', invite });
};

export const declineInvite = async (req: Request, res: Response) => {
  const { token } = req.params;

  const invite = await userInviteService.declineInvite(token);

  res.status(StatusCodes.OK).json({ message: 'Invite declined successfully', invite });
};

/**
 * ----------------- Default Exports (userInviteController) -----------------
 */
export default {
  myInvites,
  acceptInvite,
  declineInvite,
};
