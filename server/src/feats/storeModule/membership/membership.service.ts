import { Types } from 'mongoose';

import { Membership, IMembership, membershipSanitizers } from './index.js';

import { Errors } from '@/error/index.js';

/**
 * @function getMyStoreProfile
 * @description Retrieve the current user's membership profile for a specific store.
 */
export const getMyStoreProfile = async (
  userId: string,
  storeId: string
): Promise<membershipSanitizers.SanitizedMembership> => {
  const storeProfile = await Membership.findOne({
    user: new Types.ObjectId(userId),
    store: new Types.ObjectId(storeId),
  })
    .populate('user', 'username email firstName lastName') // Populate safe fields
    .populate('store', 'name location image phone') // Populate store details
    .lean();

  if (!storeProfile) {
    throw new Errors.NotFoundError('You are not a member of this store');
  }

  // Double cast for safe sanitizer usage
  return membershipSanitizers.membershipSanitizer(storeProfile as unknown as IMembership);
};

export default {
  getMyStoreProfile,
};
