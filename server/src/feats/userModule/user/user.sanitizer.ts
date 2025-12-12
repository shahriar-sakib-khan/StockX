import { HydratedDocument } from 'mongoose';

import { IUser } from './index.js';

import { listSanitizer } from '@/sanitizers/index.js';

export const userSanitizer = (doc: IUser | HydratedDocument<IUser>) => ({
  id: String(doc._id),
  firstName: doc.firstName || null,
  lastName: doc.lastName || null,
  username: doc.username,
  email: doc.email,
  role: doc.role,
  address: doc.address || null,
  image: doc.image || null,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export type SanitizedUser = ReturnType<typeof userSanitizer>;

export const allUserSanitizer = (
  docs: IUser[] | HydratedDocument<IUser>[],
  fields?: (keyof SanitizedUser)[]
) => ({
  users: listSanitizer(docs, userSanitizer, fields),
});
