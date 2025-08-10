import { HydratedDocument } from 'mongoose';

import { IUser } from '@/models';

// ----------------- User -----------------
export const userSanitizer = (user: IUser | HydratedDocument<IUser>) => ({
  id: String(user._id),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  username: user.username,
  address: user.address,
  role: user.role,
});
export type SanitizedUser = ReturnType<typeof userSanitizer>;