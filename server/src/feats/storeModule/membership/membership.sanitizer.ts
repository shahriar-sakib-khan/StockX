import { HydratedDocument } from 'mongoose';

import { storeSanitizers } from '../index.js';

import { IMembership } from './index.js';

import { resolveRef, listSanitizer, userSanitizer } from '@/sanitizers/index.js';

export const membershipSanitizer = (doc: IMembership | HydratedDocument<IMembership>) => ({
  id: String(doc._id),
  store: resolveRef(doc.store, storeSanitizers.storeSanitizer),
  user: resolveRef(doc.user, userSanitizer),
  role: doc.storeRole,
  status: doc.status,
  invitedBy: resolveRef(doc.invitedBy, userSanitizer),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export type SanitizedMembership = ReturnType<typeof membershipSanitizer>;

export const allMembershipSanitizer = (
  docs: IMembership[] | HydratedDocument<IMembership>[],
  fields?: (keyof SanitizedMembership)[]
) => ({
  memberships: listSanitizer(docs, membershipSanitizer, fields),
});
