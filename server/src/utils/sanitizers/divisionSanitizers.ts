import mongoose, { HydratedDocument } from 'mongoose';

import resolveRef from './resolveRef';
import { IDivision, IDivisionMembership } from '@/models';
import { userSanitizer } from './userSanitizers';
import { workspaceSanitizer } from './workspaceSanitizers';

// ----------------- Division -----------------
export const divisionSanitizer = (division: IDivision | HydratedDocument<IDivision>) => ({
  id: String(division._id),
  name: division.name,
  description: division.description,
  workspace: division.workspace
    ? resolveRef(division.workspace, workspaceSanitizer)
    : division.workspace,
  createdBy: division.createdBy
    ? resolveRef(division.createdBy, userSanitizer)
    : division.createdBy,
  divisionRoles: division.divisionRoles,
});
export type SanitizedDivision = ReturnType<typeof divisionSanitizer>;

// ----------------- Division List -----------------
export const allDivisionSanitizer = (divisions: IDivision[] | HydratedDocument<IDivision>[]) => ({
  divisions: divisions.map(division => ({
    id: String(division._id),
    name: division.name,
    description: division.description,
  })),
});
export type SanitizedAllDivisions = ReturnType<typeof allDivisionSanitizer>;

// ----------------- Division Membership -----------------
export const divisionMembershipSanitizer = (
  membership: IDivisionMembership | HydratedDocument<IDivisionMembership>
) => ({
  id: String(membership._id),
  divisionRoles: membership.divisionRoles,
  status: membership.status,
  user: membership.user ? resolveRef(membership.user, userSanitizer) : membership.user,
  division: membership.division
    ? resolveRef(membership.division, divisionSanitizer)
    : membership.division,
  workspace: membership.workspace
    ? resolveRef(membership.workspace, workspaceSanitizer)
    : membership.workspace,
  invitedBy: membership.invitedBy
    ? resolveRef(membership.invitedBy, userSanitizer)
    : membership.invitedBy,
});
export type SanitizedDivisionMembership = ReturnType<typeof divisionMembershipSanitizer>;

// ----------------- Division Members -----------------
export const divisionMembersSanitizer = (
  members: IDivisionMembership[] | HydratedDocument<IDivisionMembership>[]
) => ({
  members: members.map(membership => ({
    user: membership.user ? resolveRef(membership.user, userSanitizer) : membership.user,
    division: membership.division
      ? resolveRef(membership.division, divisionSanitizer)
      : membership.division,
    workspace: membership.workspace
      ? resolveRef(membership.workspace, workspaceSanitizer)
      : membership.workspace,
    divisionRoles: membership.divisionRoles,
    status: membership.status,
    invitedBy: membership.invitedBy
      ? resolveRef(membership.invitedBy, userSanitizer)
      : membership.invitedBy,
  })),
});
export type SanitizedDivisionMembers = ReturnType<typeof divisionMembersSanitizer>;
