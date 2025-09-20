import { HydratedDocument } from 'mongoose';

import { resolveRef, listSanitizer, userSanitizer } from '@/sanitizers/index.js';

import { storeSanitizers } from '../index.js';
import { IMembership } from './index.js';

/**
 * ----------------- Membership -----------------
 */
export const membershipSanitizer = (membership: IMembership | HydratedDocument<IMembership>) => ({
  id: String(membership._id),
  store: resolveRef(membership.store ?? null, storeSanitizers.storeSanitizer),
  user: resolveRef(membership.user ?? null, userSanitizer),
  storeRoles: membership.storeRoles ?? [],
  status: membership.status,
  invitedBy: membership.invitedBy ? resolveRef(membership.invitedBy, userSanitizer) : null,
  removedBy: membership.removedBy ? resolveRef(membership.removedBy, userSanitizer) : null,
  createdAt: membership.createdAt,
  updatedAt: membership.updatedAt,
});

export type SanitizedMembership = ReturnType<typeof membershipSanitizer>;

/**
 * ----------------- Membership List -----------------
 * Can optionally select only specific fields
 */
export const allMembershipSanitizer = (
  memberships: IMembership[] | HydratedDocument<IMembership>[],
  fields?: (keyof SanitizedMembership)[]
) => ({
  memberships: listSanitizer(memberships, membershipSanitizer, fields),
});

export type SanitizedMemberships = ReturnType<typeof allMembershipSanitizer>;
