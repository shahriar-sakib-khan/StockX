import { HydratedDocument } from 'mongoose';

import { IDivisionMembership } from '@/models';
import {
  resolveRef,
  listSanitizer,
  userSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
} from '@/utils/sanitizers';

/**
 * ----------------- Division Membership -----------------
 */
export const divisionMembershipSanitizer = (
  membership: IDivisionMembership | HydratedDocument<IDivisionMembership>
) => ({
  id: String(membership._id),
  divisionRoles: membership.divisionRoles ?? [],
  status: membership.status,
  user: resolveRef(membership.user ?? null, userSanitizer),
  division: resolveRef(membership.division ?? null, divisionSanitizer),
  workspace: resolveRef(membership.workspace ?? null, workspaceSanitizer),
  addedBy: resolveRef(membership.addedBy ?? null, userSanitizer),
});

export type SanitizedDivisionMembership = ReturnType<typeof divisionMembershipSanitizer>;

/**
 * ----------------- Division Members -----------------
 * Can optionally select only specific fields
 */
export const allDivisionMembershipSanitizer = (
  members: IDivisionMembership[] | HydratedDocument<IDivisionMembership>[],
  fields?: (keyof SanitizedDivisionMembership)[]
) => ({
  members: listSanitizer(members, divisionMembershipSanitizer, fields),
});

export type SanitizedDivisionMemberships = ReturnType<typeof allDivisionMembershipSanitizer>;
