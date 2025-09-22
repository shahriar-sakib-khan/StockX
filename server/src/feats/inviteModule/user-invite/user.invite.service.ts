import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { Membership } from '@/models/index.js';

import { Invite, inviteSanitizers } from '../index.js';

/**
 * @function getUserInvites
 * Fetches all invites associated with a given user.
 *
 * @param {string} userId - The user's unique ID.
 * @param {number} page - Current page number for pagination.
 * @param {number} limit - Max number of invites per page.
 * @returns {Promise<inviteSanitizers.SanitizedInvites>} List of sanitized invites.
 */
export const getUserInvites = async (
  userId: string,
  page: number,
  limit: number
): Promise<inviteSanitizers.SanitizedInvites & { total: number }> => {
  const total = await Invite.countDocuments({
    user: userId,
    status: { $in: ['pending', 'sent'] },
  });
  if (total === 0) return { invites: [], total };

  const skip = (page - 1) * limit;
  const invites = await Invite.find({
    user: userId,
    status: { $in: ['pending', 'sent'] },
  })
    .skip(skip)
    .limit(limit)
    .populate('store', 'name')
    .lean();

  return {
    invites: inviteSanitizers.allInviteSanitizer(invites, [
      'id',
      'token',
      'store',
      'role',
      'status',
      'expiresAt',
    ]).invites,
    total,
  };
};

/**
 * @function acceptInvite
 * Accepts a user invite based on a token.
 *
 * @param {string} userId - The user's unique ID.
 * @param {string} token - Invite token.
 * @returns {Promise<inviteSanitizers.SanitizedInvite>} Accepted invite document.
 * @throws {Errors.NotFoundError} If invite token is invalid.
 * @throws {Errors.BadRequestError} If invite has expired or already been dealt with.
 */
export const acceptInvite = async (
  userId: string,
  token: string
): Promise<inviteSanitizers.SanitizedInvite> => {
  const invite = await Invite.findOne({ token });

  if (!invite) throw new Errors.NotFoundError('Invite not found');
  if (invite.status !== 'pending' && invite.status !== 'sent')
    throw new Errors.BadRequestError('Invite already dealt with');
  if (invite.expiresAt < new Date()) throw new Errors.BadRequestError('Invitation expired');

  // Create membership
  await Membership.create({
    store: invite.store,
    user: new Types.ObjectId(userId),
    storeRoles: [invite.role],
    status: 'active',
  });

  // Update invite status
  invite.status = 'accepted';
  await invite.save();

  return inviteSanitizers.inviteSanitizer(invite);
};

/**
 * @function declineInvite
 * Declines a user invite based on a token.
 *
 * @param {string} token - Invite token.
 * @returns {Promise<inviteSanitizers.SanitizedInvite>} Declined invite document.
 * @throws {Errors.NotFoundError} If invite token is invalid.
 * @throws {Errors.BadRequestError} If invite has expired or already been dealt with.
 */
export const declineInvite = async (token: string): Promise<inviteSanitizers.SanitizedInvite> => {
  const invite = await Invite.findOne({ token });

  if (!invite) throw new Errors.NotFoundError('Invite not found');
  if (invite.status !== 'pending' && invite.status !== 'sent')
    throw new Errors.BadRequestError('Invite already dealt with');
  if (invite.expiresAt < new Date()) throw new Errors.BadRequestError('Invitation expired');

  // Update invite status
  invite.status = 'declined';
  await invite.save();

  return inviteSanitizers.inviteSanitizer(invite);
};

/**
 * ----------------- Default Exports (userInviteService) -----------------
 */
export default {
  getUserInvites, // Fetch all invites for a user
  acceptInvite, // Accept an invite using token
  declineInvite, // Decline an invite using token
};
