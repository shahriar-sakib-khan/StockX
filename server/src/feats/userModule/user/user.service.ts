import { ClientSession } from 'mongoose';

import { IUser, User, userSanitizers, userValidator } from './index.js';

import { Errors } from '@/error/index.js';
import { logger } from '@/utils/index.js';

/**
 * @function getCurrentUser
 * @description Retrieves a user by ID. Read-only.
 */
export const getCurrentUser = async (userId: string): Promise<userSanitizers.SanitizedUser> => {
  const user = await User.findById(userId).lean();

  if (!user) throw new Errors.NotFoundError('User not found');

  return userSanitizers.userSanitizer(user as unknown as IUser);
};

/**
 * @function updateUser
 * @description Update user profile details.
 */
export const updateUser = async (
  userId: string,
  data: userValidator.UpdateUserInput,
  session?: ClientSession
): Promise<userSanitizers.SanitizedUser> => {
  if (data.email) {
    const existingUser = await User.exists({
      email: data.email,
      _id: { $ne: userId },
    }).session(session || null);

    if (existingUser) {
      throw new Errors.BadRequestError('Email is already in use');
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    {
      new: true,
      session,
      runValidators: true,
    }
  ).lean();

  if (!user) throw new Errors.NotFoundError('User not found');

  logger.info(`User profile updated: ${userId}`); // [LOG]

  return userSanitizers.userSanitizer(user as unknown as IUser);
};

export default {
  getCurrentUser,
  updateUser,
};
