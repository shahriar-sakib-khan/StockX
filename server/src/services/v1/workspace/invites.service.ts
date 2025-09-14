import { Types } from 'mongoose';

import { Invite, Membership, User } from '@/models/index.js';
import { Errors } from '@/error/index.js';
import { workspace } from '@/validations/index.js';
import { Tokens } from '@/utils/index.js';
import { workspaceMembershipSanitizers } from '@/sanitizers/index.js';

/**
 * @function sendWorkspaceInvite
 * Sends an invite to join a workspace.
 *
 * @param {workspace.InviteInput} userData - User data.
 * @param {string} userId - User ID.
 * @param {string} workspaceId - Workspace ID.
 * @returns {Promise<HydratedDocument<IInvite>>} Invite document.
 */
export const sendWorkspaceInvite = async (
  userData: workspace.InviteInput,
  userId: string,
  workspaceId: string
): Promise<workspaceMembershipSanitizers.SanitizedWorkspaceInvite> => {
  const { email } = userData;

  const existingUser = await User.findOne({ email }).select('_id');
  if (existingUser) {
    const existingMembership = await Membership.exists({
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

  const token = Tokens.generateCryptoToken();

  const invite = await Invite.create({
    user: existingUser?._id || null,
    email,
    role: 'user', // By default assign user role
    token,
    workspace: new Types.ObjectId(workspaceId),
    invitedBy: new Types.ObjectId(userId),
    expiresAt: new Date(Date.now() + Number(process.env.INVITE_EXPIRY_MS)),
    status: existingUser ? 'sent' : 'pending',
  });

  return workspaceMembershipSanitizers.workspaceInviteSanitizer(invite);
};

/**
 * @function getAllMyInvites
 * Gets all invites sent to the logged in user.
 *
 * @param {string} userId - Logged in user ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<SanitizedWorkspaceInvite[]>} Array of invite documents.
 */
export const getAllMyInvites = async (
  userId: string,
  page: number,
  limit: number
): Promise<workspaceMembershipSanitizers.SanitizedWorkspaceInvites & { total: number }> => {
  const total = await Invite.countDocuments({ user: userId, status: { $in: ['sent', 'pending'] } });
  if (total === 0) return { invites: [], total };

  const skip = (page - 1) * limit;
  const invites = await Invite.find({ user: userId, status: { $in: ['sent', 'pending'] } })
    .skip(skip)
    .limit(limit)
    .populate('workspace', 'name')
    .populate('invitedBy', 'username email')
    .lean();

  return {
    invites: workspaceMembershipSanitizers.allWorkspaceInviteSanitizer(invites, [
      'id',
      'token',
      'role',
      'workspace',
      'status',
      'invitedBy',
      'expiresAt',
    ]).invites,
    total,
  };
};

/**
 * @function acceptWorkspaceInvite
 * Accepts an invite to join a workspace.
 *
 * @param {string} token - Invite token.
 * @param {string} userId - Logged in user ID.
 * @returns {Promise<SanitizedWorkspaceInvite>} Invite document.
 */
export const acceptWorkspaceInvite = async (
  token: string,
  userId: string
): Promise<workspaceMembershipSanitizers.SanitizedWorkspaceInvite> => {
  const invite = await Invite.findOne({ token });

  if (!invite) throw new Errors.BadRequestError('Invalid invitation.');
  if (invite.expiresAt < new Date()) throw new Errors.BadRequestError('Expired invitation.');
  if (invite.user?.toString() !== userId) throw new Errors.BadRequestError('Invalid invite.');

  if (invite.status === 'accepted' || invite.status === 'declined' || invite.status === 'expired')
    throw new Errors.BadRequestError('Invitation already dealt with.');

  await Membership.create({
    user: new Types.ObjectId(userId),
    workspace: invite.workspace,
    workspaceRoles: [invite.role],
    invitedBy: invite.invitedBy,
    status: 'active',
  });

  invite.status = 'accepted';
  await invite.save();

  return workspaceMembershipSanitizers.workspaceInviteSanitizer(invite);
};

/**
 * @function declineWorkspaceInvite
 * Declines an invite to join a workspace.
 *
 * @param {string} token - Invite token.
 * @param {string} userId - User ID.
 * @returns {Promise<SanitizedWorkspaceInvite>} Invite document.
 */
export const declineWorkspaceInvite = async (
  token: string,
  userId: string
): Promise<workspaceMembershipSanitizers.SanitizedWorkspaceInvite> => {
  const invite = await Invite.findOne({ token });

  if (!invite) throw new Errors.BadRequestError('Invalid invitation');

  if (invite.user?.toString() !== userId) throw new Errors.BadRequestError('Invalid invite.');

  if (invite.expiresAt < new Date()) throw new Errors.BadRequestError('Invitation expired');

  if (invite.status !== 'sent' && invite.status !== 'pending')
    throw new Errors.BadRequestError('Invite already dealt with.');

  invite.status = 'declined';
  await invite.save();

  return workspaceMembershipSanitizers.workspaceInviteSanitizer(invite);
};

/**
 * @function getAllInvites
 * Gets all invites for a workspace.
 *
 * @param {string} workspaceId - Workspace ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<SanitizedWorkspaceInvite[]>} Array of invite documents.
 */
export const getAllInvites = async (
  workspaceId: string,
  page: number,
  limit: number
): Promise<workspaceMembershipSanitizers.SanitizedWorkspaceInvites & { total: number }> => {
  const total: number = await Invite.countDocuments({ workspace: new Types.ObjectId(workspaceId) });

  if (total === 0) return { invites: [], total };

  const skip: number = (page - 1) * limit;
  const allInvites = await Invite.find({ workspace: workspaceId }).skip(skip).limit(limit).lean();

  return {
    invites: workspaceMembershipSanitizers.allWorkspaceInviteSanitizer(allInvites, [
      'id',
      'email',
      'role',
      'status',
      'expiresAt',
    ]).invites,
    total,
  };
};

/**
 * @function getSingleInvite
 * Gets an invite to join a workspace.
 *
 * @param {string} inviteId - Invite ID.
 * @returns {Promise<SanitizedWorkspaceInvite>} Invite document.
 * @throws {BadRequestError} If invite is invalid.
 */
export const getSingleInvite = async (
  inviteId: string
): Promise<workspaceMembershipSanitizers.SanitizedWorkspaceInvite> => {
  const invite = await Invite.findById(inviteId);
  if (!invite) throw new Errors.BadRequestError('Invalid invite.');

  return workspaceMembershipSanitizers.workspaceInviteSanitizer(invite);
};

/**
 * @function deleteWorkspaceInvite
 * Deletes an invite to join a workspace.
 *
 * @param {string} inviteId - Invite ID.
 * @returns {Promise<SanitizedWorkspaceInvite>} Invite document.
 */
export const deleteWorkspaceInvite = async (
  inviteId: string
): Promise<workspaceMembershipSanitizers.SanitizedWorkspaceInvite> => {
  const invite = await Invite.findById(inviteId);
  if (!invite) throw new Errors.BadRequestError('Invalid invite.');

  await invite.deleteOne();

  return workspaceMembershipSanitizers.workspaceInviteSanitizer(invite);
};

export default {
  sendWorkspaceInvite,
  getAllInvites,
  getSingleInvite,
  deleteWorkspaceInvite,

  getAllMyInvites,
  acceptWorkspaceInvite,
  declineWorkspaceInvite,
};
