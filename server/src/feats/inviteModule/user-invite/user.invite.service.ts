import { Types, ClientSession } from 'mongoose';

import { Invite, IInvite, inviteSanitizers } from '../index.js';

import { Errors } from '@/error/index.js';
import { Membership } from '@/feats/storeModule/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function getUserInvites
 * @description Retrieves invites for a specific user with pagination.
 */
export const getUserInvites = async (
  userId: string,
  page: number,
  limit: number
): Promise<{ invites: Partial<inviteSanitizers.SanitizedInvite>[]; total: number }> => {
  const skip = (page - 1) * limit;
  const userObjectId = new Types.ObjectId(userId);

  const query = {
    user: userObjectId,
    status: { $in: ['pending', 'sent'] },
  };

  const [invites, total] = await Promise.all([
    Invite.find(query).skip(skip).limit(limit).populate('store', 'name').lean(),
    Invite.countDocuments(query),
  ]);

  return {
    invites: inviteSanitizers.allInviteSanitizer(invites as unknown as IInvite[], [
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
 * @description Accepts an invite and creates a membership
 */
export const acceptInvite = async (
  userId: string,
  token: string,
  session?: ClientSession
): Promise<inviteSanitizers.SanitizedInvite> => {
  // 1. Find Invite
  const invite = await Invite.findOne({ token }).session(session || null);
  if (!invite) throw new Errors.NotFoundError('Invite not found');

  // 2. Validate
  if (invite.status !== 'pending' && invite.status !== 'sent') {
    throw new Errors.BadRequestError('Invite already dealt with');
  }
  if (invite.expiresAt < new Date()) {
    throw new Errors.BadRequestError('Invitation expired');
  }

  // 3. Update Invite
  invite.user = new Types.ObjectId(userId);
  invite.status = 'accepted';
  await invite.save({ session });

  // 4. Create Membership
  const membershipExists = await Membership.exists({
    store: invite.store,
    user: userId,
  }).session(session || null);

  if (!membershipExists) {
    await Membership.create(
      [
        {
          store: invite.store,
          user: new Types.ObjectId(userId),
          storeRoles: [invite.role],
          status: 'active',
          invitedBy: invite.invitedBy,
        },
      ],
      { session }
    );
  }

  logger.info(`Invite accepted: User ${userId} joined Store ${invite.store} as ${invite.role}`); // [LOG]

  return inviteSanitizers.inviteSanitizer(invite);
};

/**
 * @function declineInvite
 * @description Declines an invite
 */
export const declineInvite = async (
  token: string,
  session?: ClientSession
): Promise<inviteSanitizers.SanitizedInvite> => {
  const invite = await Invite.findOne({ token }).session(session || null);
  if (!invite) throw new Errors.NotFoundError('Invite not found');

  if (invite.status !== 'pending' && invite.status !== 'sent') {
    throw new Errors.BadRequestError('Invite already dealt with');
  }

  invite.status = 'declined';
  await invite.save({ session });

  logger.info(`Invite declined: ${invite.email}`); // [LOG]

  return inviteSanitizers.inviteSanitizer(invite);
};

export default {
  getUserInvites,
  acceptInvite,
  declineInvite,
};
