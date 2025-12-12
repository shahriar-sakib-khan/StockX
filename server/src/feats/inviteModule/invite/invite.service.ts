import { Types, ClientSession } from 'mongoose';

import { InviteExpirationMap } from './invite.constants.js';

import { Invite, IInvite, inviteSanitizers, inviteValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { Membership } from '@/feats/storeModule/index.js';
import { User } from '@/feats/userModule/index.js';
import { Tokens, logger } from '@/utils/index.js';

/**
 * @function createInvite
 * @description Creates a new store invite for a Partner/Co-Owner.
 */
export const createInvite = async (
  inviteData: inviteValidator.CreateInviteInput,
  invitedBy: string,
  storeId: string,
  session?: ClientSession
): Promise<inviteSanitizers.SanitizedInvite> => {
  const { email, role, lifespan } = inviteData;

  // 1. Check if user exists (Read)
  const existingUser = await User.findOne({ email })
    .session(session || null)
    .select('_id')
    .lean();

  if (existingUser) {
    // Check if already a member
    const existingMembership = await Membership.exists({
      user: existingUser._id,
      store: storeId,
    }).session(session || null);

    if (existingMembership) {
      throw new Errors.BadRequestError('User is already a member of this store');
    }
  }

  // 2. Remove previous invites (Write)
  await Invite.deleteMany({ email, store: storeId }, { session });

  // 3. Prepare Data
  const token = Tokens.generateCryptoToken();
  const expiresAt = new Date(Date.now() + InviteExpirationMap[lifespan]);
  const status = existingUser ? 'sent' : 'pending';

  // 4. Create Invite (Write)
  const [invite] = await Invite.create(
    [
      {
        user: existingUser?._id || null,
        email,
        role,
        status,
        token,
        store: new Types.ObjectId(storeId),
        invitedBy: new Types.ObjectId(invitedBy),
        lifespan,
        expiresAt,
      },
    ],
    { session }
  );

  // [LOG]
  logger.info(`Invite sent: ${email} for role ${role} in store ${storeId}`);

  return inviteSanitizers.inviteSanitizer(invite);
};

/**
 * @function getAllInvites
 * @description Retrieves all invites for a specific store with pagination.
 */
export const getAllInvites = async (
  storeId: string,
  page: number,
  limit: number
): Promise<{ invites: Partial<inviteSanitizers.SanitizedInvite>[]; total: number }> => {
  const skip = (page - 1) * limit;

  const [invites, total] = await Promise.all([
    Invite.find({ store: storeId }).skip(skip).limit(limit).lean(),
    Invite.countDocuments({ store: storeId }),
  ]);

  return {
    invites: inviteSanitizers.allInviteSanitizer(invites as unknown as IInvite[], [
      'id',
      'user',
      'email',
      'role',
      'status',
      'token',
      'expiresAt',
    ]).invites,
    total,
  };
};

/**
 * @function getSingleInvite
 * @description Retrieves a single invite by its ID.
 */
export const getSingleInvite = async (
  inviteId: string
): Promise<inviteSanitizers.SanitizedInvite> => {
  const invite = await Invite.findById(inviteId).lean();
  if (!invite) throw new Errors.NotFoundError('Invite not found');

  return inviteSanitizers.inviteSanitizer(invite as unknown as IInvite);
};

/**
 * @function deleteInvite
 */
export const deleteInvite = async (
  inviteId: string,
  session?: ClientSession
): Promise<inviteSanitizers.SanitizedInvite> => {
  const invite = await Invite.findByIdAndDelete(inviteId, { session }).lean();
  if (!invite) throw new Errors.NotFoundError('Invite not found');

  logger.info(`Invite revoked: ${invite.email} (${inviteId})`); // [LOG]

  return inviteSanitizers.inviteSanitizer(invite as unknown as IInvite);
};

export default {
  createInvite,
  getAllInvites,
  getSingleInvite,
  deleteInvite,
};
