import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { Tokens } from '@/utils/index.js';

import { User } from '../../userModule/index.js';
import { Membership } from '../../storeModule/index.js';
import { InviteExpirationMap } from './invite.constants.js';
import { Invite, inviteSanitizers, inviteValidator } from './index.js';

/**
 * @function createInvite
 * Creates a new store invite.
 *
 * @param {CreateInviteInput} inviteData - Invite data.
 * @param {string} storeId - Store ID.
 * @param {string} invitedBy - ID of the user sending the invite.
 * @returns {Promise<inviteSanitizers.SanitizedInvite>} Sanitized invite document.
 */
export const createInvite = async (
  inviteData: inviteValidator.CreateInviteInput,
  invitedBy: string,
  storeId: string
): Promise<inviteSanitizers.SanitizedInvite> => {
  const { email, role, lifespan } = inviteData;

  // Check if user already exists and belongs to the store
  const existingUser = await User.findOne({ email }).select('_id');

  if (existingUser) {
    const existingMembership = await Membership.exists({
      user: existingUser._id,
      store: storeId,
    });
    if (existingMembership)
      throw new Errors.NotFoundError('User already invited or part of this store');
  }

  // Remove any previous invites for this email and store
  const existingInvite = await Invite.findOne({ email, store: storeId });
  if (existingInvite) await existingInvite.deleteOne();

  // Generate a unique token for the invite
  const token = Tokens.generateCryptoToken();

  // Calculate expiration date based on lifespan
  const expiresAt = new Date(Date.now() + InviteExpirationMap[lifespan]);

  // Status will be 'sent' if user already exists and 'pending' otherwise
  const status = existingUser ? 'sent' : 'pending';

  // Create the invite
  const invite = await Invite.create({
    user: existingUser?._id ?? null,
    email,
    role,
    status,
    token,
    store: new Types.ObjectId(storeId),
    invitedBy: new Types.ObjectId(invitedBy),
    lifespan,
    expiresAt,
  });

  console.log('Invite created:', invite);

  return inviteSanitizers.inviteSanitizer(invite);
};

/**
 * @function getAllInvites
 * Fetches all invites for a store with pagination.
 *
 * @param {string} storeId - Store ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<{ invites: SanitizedInvite[]; total: number }>} List of invites with total count.
 */
export const getAllInvites = async (
  storeId: string,
  page: number,
  limit: number
): Promise<inviteSanitizers.SanitizedInvites & { total: number }> => {
  const total: number = await Invite.countDocuments({ store: new Types.ObjectId(storeId) });
  if (total === 0) return { invites: [], total };

  const skip: number = (page - 1) * limit;
  const invites = await Invite.find({ store: storeId }).skip(skip).limit(limit).lean();

  return {
    invites: inviteSanitizers.allInviteSanitizer(invites, [
      'id',
      'user',
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
 * Fetches a single invite by ID.
 *
 * @param {string} inviteId - Invite ID.
 * @returns {Promise<inviteSanitizers.SanitizedInvite>} Sanitized invite document.
 * @throws {Errors.NotFoundError} If invite is invalid or not found.
 */
export const getSingleInvite = async (
  inviteId: string
): Promise<inviteSanitizers.SanitizedInvite> => {
  const invite = await Invite.findById(inviteId);
  if (!invite) throw new Errors.NotFoundError('Invite not found.');

  return inviteSanitizers.inviteSanitizer(invite);
};

/**
 * @function deleteInvite
 * Deletes an invite by ID.
 *
 * @param {string} inviteId - Invite ID.
 * @returns {Promise<inviteSanitizers.SanitizedInvite>} Deleted invite document.
 * @throws {Errors.NotFoundError} If invite is invalid or not found.
 */
export const deleteInvite = async (inviteId: string): Promise<inviteSanitizers.SanitizedInvite> => {
  const invite = await Invite.findById(inviteId);
  if (!invite) throw new Errors.NotFoundError('Invite not found.');

  await invite.deleteOne();

  return inviteSanitizers.inviteSanitizer(invite);
};

/**
 * ----------------- Default Exports (inviteService) -----------------
 */
export default {
  createInvite, // Create a new invite
  getAllInvites, // Get paginated invites for a store
  getSingleInvite, // Fetch a single invite by ID
  deleteInvite, // Delete an invite
};
