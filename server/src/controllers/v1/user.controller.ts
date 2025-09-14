/**
 * ----------------- User Controller -----------------
 *
 * Handles all logic for retrieving and updating the current user.
 *
 * @module controllers/user
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { inviteService, userService } from '@/services/v1/index.js';
import { assertAuth } from '@/common/index.js';

/**
 * ----------------- User CRUD -----------------
 */

export const getCurrentUser = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const user = await userService.getCurrentUser(userId);

  res.status(StatusCodes.OK).json({ user });
};

export const updateUser = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const updatedUser = await userService.updateUser(userId, req.body);

  res
    .status(StatusCodes.OK)
    .json({ message: 'User profile updated successfully', user: updatedUser });
};

/**
 * ----------------- User Invites -----------------
 */

export const myInvites = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { invites, total } = await inviteService.getAllMyInvites(userId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, invites });
};

export const acceptInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { token } = req.params;

  const invite = await inviteService.acceptWorkspaceInvite(token, userId);

  res.status(StatusCodes.OK).json({
    message: 'Invite accepted successfully',
    invite,
  });
};

export const declineInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { token } = req.params;

  const invite = await inviteService.declineWorkspaceInvite(token, userId);

  res.status(StatusCodes.OK).json({
    message: 'Invite declined successfully',
    invite,
  });
};

/**
 * ----------------- Default export (user controllers) -----------------
 */
export default {
  // User CRUD
  getCurrentUser, // Fetches current user by ID, returns sanitized user object
  updateUser, // Updates allowed fields of current user, validates email, returns sanitized user

  // User Invites
  myInvites, // Fetches current user's invites, returns sanitized invites
  acceptInvite, // Accepts invite, returns sanitized invite
  declineInvite, // Declines invite, returns sanitized invite
};
