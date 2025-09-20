import { HydratedDocument } from 'mongoose';

/**
 * @module UserSanitizer
 *
 * @description Provides sanitizers for User model to shape responses
 */

import { listSanitizer } from '@/sanitizers/index.js';

import { IUser } from './index.js';

/**
 * ----------------- Single User -----------------
 * Sanitizes a single User document by removing sensitive fields.
 */
export const userSanitizer = (user: IUser | HydratedDocument<IUser>) => ({
  id: String(user._id),
  firstName: user.firstName ?? null,
  lastName: user.lastName ?? null,
  username: user.username,
  email: user.email,
  address: user.address ?? null,
  image: user.image ?? null,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export type SanitizedUser = ReturnType<typeof userSanitizer>;

/**
 * ----------------- User List -----------------
 * Optionally selects only specified fields.
 */
export const allUserSanitizer = (
  users: IUser[] | HydratedDocument<IUser>[],
  fields?: (keyof SanitizedUser)[]
) => ({
  users: listSanitizer(users, userSanitizer, fields),
});

export type SanitizedUsers = ReturnType<typeof allUserSanitizer>;
