/**
 * @module user.service
 *
 * @description Services for user-related operations.
 */

import { Errors } from '@/error/index.js';

import { User, userSanitizers, userValidator } from './index.js';

/**
 * ----------------- User CRUD Services -----------------
 */

/**
 * @function getCurrentUser
 * @description Retrieves the currently authenticated user by their ID.
 *
 * @param {string} userId - The user's unique ID.
 * @returns {Promise<userSanitizers.SanitizedUser>} Sanitized user document.
 * @throws {Errors.NotFoundError} If user not found.
 */
export const getCurrentUser = async (userId: string): Promise<userSanitizers.SanitizedUser> => {
  const user = await User.findById(userId).lean();

  if (!user) throw new Errors.NotFoundError('User not found');

  return userSanitizers.userSanitizer(user);
};

/**
 * @function updateUser
 * @description Updates allowed fields for the current user.
 *
 * @param {string} userId - The user's unique ID.
 * @param {userValidator.UpdateUserInput} updateData - Fields to update.
 * @returns {Promise<userSanitizers.SanitizedUser>} Updated sanitized user.
 * @throws {Errors.NotFoundError} If user not found.
 */
export const updateUser = async (
  userId: string,
  updateData: userValidator.UpdateUserInput
): Promise<userSanitizers.SanitizedUser> => {
  const { firstName, lastName, username, email, address, image } = updateData;

  const user = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, username, email, address, image },
    { new: true }
  )
    .select('firstName lastName username email address image')
    .lean();

  if (!user) throw new Errors.NotFoundError('User not found');

  return userSanitizers.userSanitizer(user);
};

export default {
  getCurrentUser, // Fetches current user by ID, returns sanitized user object
  updateUser, // Updates allowed fields of current user, returns sanitized user
};
