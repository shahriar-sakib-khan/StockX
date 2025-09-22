/**
 * @module InviteController
 *
 * @description Controller for store invite related operations.
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { inviteService } from './index.js';

/**
 * ----------------- Store Invite CRUD Controllers -----------------
 */

export const sendInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { storeId } = req.params;

  const invite = await inviteService.createInvite(req.body, userId, storeId);

  res.status(StatusCodes.CREATED).json({ message: 'Invite sent successfully', invite });
};

export const allInvites = async (req: Request, res: Response) => {
  assertAuth(req);
  const { storeId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { invites, total } = await inviteService.getAllInvites(storeId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, invites });
};

export const singleInvite = async (req: Request, res: Response) => {
  const { inviteId } = req.params;

  const invite = await inviteService.getSingleInvite(inviteId);

  res.status(StatusCodes.OK).json({ invite });
};

export const deleteInvite = async (req: Request, res: Response) => {
  const { inviteId } = req.params;

  const invite = await inviteService.deleteInvite(inviteId);

  res.status(StatusCodes.OK).json({ message: 'Invite deleted successfully', invite });
};

/**
 * ----------------- Default Exports (inviteController) -----------------
 */
export default {
  sendInvite,
  allInvites,
  singleInvite,
  deleteInvite,
};
