import { HydratedDocument, Types } from 'mongoose';

import { IInvite, Invite, Membership, User, IMembership } from '@/models';
import { Errors } from '@/error';
import { InviteInput } from '@/validations/workspace.validation';
import { Tokens } from '@/utils';

/**
 * @function sendWorkspaceInvite
 * Sends an invite to join a workspace.
 *
 * @param {InviteInput} userData - User data.
 * @param {string} userId - User ID.
 * @param {string} workspaceId - Workspace ID.
 * @returns {Promise<HydratedDocument<IInvite>>} Invite document.
 */
export const sendWorkspaceInvite = async (
  userData: InviteInput,
  userId: string,
  workspaceId: string
): Promise<HydratedDocument<IInvite>> => {
  const { email, role } = userData;

  const existingUser = await User.findOne({ email }).select('_id');
  if (existingUser) {
    const existingMembership = await Membership.findOne({
      user: existingUser._id,
      workspace: workspaceId,
    });
    if (existingMembership) throw new Errors.BadRequestError('Already a member of this workspace');
  }

  // Delete existing invite
  const existingInvite = await Invite.findOne({
    email,
    workspace: workspaceId,
  });
  if (existingInvite) await existingInvite.deleteOne();

  const token = Tokens.generateToken();

  const invite = await Invite.create({
    user: existingUser?._id || null,
    email,
    role,
    token,
    workspace: new Types.ObjectId(workspaceId),
    invitedBy: new Types.ObjectId(userId),
    expiresAt: new Date(Date.now() + Number(process.env.INVITE_EXPIRY_MS)),
    status: existingUser ? 'sent' : 'pending',
  });

  return invite;
};

/**
 * @function acceptWorkspaceInvite
 * Accepts an invite to join a workspace.
 *
 * @param {string} token - Invite token.
 * @param {string} userId - User ID.
 * @returns {Promise<HydratedDocument<IInvite>>} Invite document.
 */
export const acceptWorkspaceInvite = async (
  token: string,
  userId: string
): Promise<HydratedDocument<IInvite>> => {
  const invite = await Invite.findOne({ token });

  if (!invite) throw new Errors.BadRequestError('Invalid invitation');

  if (invite.user?.toString() !== userId) throw new Errors.BadRequestError('Invalid invite.');

  if (invite.expiresAt < new Date()) throw new Errors.BadRequestError('Invitation expired');

  if (invite.status !== 'sent' && invite.status !== 'pending')
    throw new Errors.BadRequestError('Invite already dealt with.');

  await Membership.create({
    user: new Types.ObjectId(userId),
    workspace: invite.workspace,
    workspaceRoles: [invite.role],
    invitedBy: invite.invitedBy,
    status: 'active',
  });

  invite.status = 'accepted';
  await invite.save();

  return invite;
};

/**
 * @function declineWorkspaceInvite
 * Declines an invite to join a workspace.
 *
 * @param {string} token - Invite token.
 * @param {string} userId - User ID.
 * @returns {Promise<HydratedDocument<IInvite>>} Invite document.
 */
export const declineWorkspaceInvite = async (
  token: string,
  userId: string
): Promise<HydratedDocument<IInvite>> => {
  const invite = await Invite.findOne({ token });

  if (!invite) throw new Errors.BadRequestError('Invalid invitation');

  if (invite.user?.toString() !== userId) throw new Errors.BadRequestError('Invalid invite.');

  if (invite.expiresAt < new Date()) throw new Errors.BadRequestError('Invitation expired');

  if (invite.status !== 'sent' && invite.status !== 'pending')
    throw new Errors.BadRequestError('Invite already dealt with.');

  invite.status = 'declined';
  await invite.save();

  return invite;
};

/**
 * @function getEmailInvites
 * Gets all email invites for a workspace.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<HydratedDocument<IInvite>[]>} Array of invite documents.
 */
export const getEmailInvites = async (
  workspaceId: string,
  page: number,
  limit: number
): Promise<HydratedDocument<IInvite>[]> => {
  const emailInvites = await Invite.find({ workspace: workspaceId, status: 'pending' })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('workspace', 'name')
    .populate('invitedBy', 'email firstName lastName');

  return emailInvites;
};

/**
 * @function getRegisteredUserInvites
 * Gets all registered user invites for a workspace.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<HydratedDocument<IMembership>[]>} Array of invite documents.
 */
export const getRegisteredUserInvites = async (
  workspaceId: string,
  page: number,
  limit: number
): Promise<HydratedDocument<IMembership>[]> => {
  const registeredUserInvites = await Membership.find({ workspace: workspaceId, status: 'invited' })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'email firstName lastName');

  return registeredUserInvites;
};

/**
 * @function getAllInvites
 * Gets all invites for a workspace.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<HydratedDocument<IInvite>[]>} Array of invite documents.
 */
export const getAllInvites = async (
  workspace: string,
  page: number,
  limit: number
): Promise<HydratedDocument<IInvite>[]> => {
  const skip: number = (page - 1) * limit;

  const allInvites = await Invite.find({ workspace }).skip(skip).limit(limit);

  return allInvites;
};

export const deleteWorkspaceInvite = async (token: string): Promise<HydratedDocument<IInvite>> => {
  const invite = await Invite.findOne({ token });
  if (!invite) throw new Errors.BadRequestError('Invalid invite.');

  await invite.deleteOne();

  return invite;
};

export default {
  sendWorkspaceInvite,
  acceptWorkspaceInvite,
  declineWorkspaceInvite,
  getAllInvites,
  deleteWorkspaceInvite,
};
