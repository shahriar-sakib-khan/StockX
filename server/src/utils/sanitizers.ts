import { HydratedDocument, Types } from 'mongoose';

import { IDivision, IDivisionMembership, IInvite, IMembership, IUser, IWorkspace } from '@/models';

// Generic Ref Resolver: handles both ObjectId and populated objects
function resolveRef<T extends { _id: any }>(ref: Types.ObjectId | T, sanitizer: (doc: T) => any) {
  if (!ref) return '';

  // If it's a plain ObjectId, do NOT sanitize
  if (typeof ref === 'object' && '_id' in ref && Object.keys(ref).length > 1) {
    return sanitizer(ref as T); // likely populated
  }

  return String(ref); // just return the ID
}

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

// ----------------- Workspace -----------------
export const workspaceSanitizer = (workspace: IWorkspace | HydratedDocument<IWorkspace>) => ({
  id: String(workspace._id),
  name: workspace.name,
  description: workspace.description,
  createdBy: workspace.createdBy
    ? resolveRef(workspace.createdBy, userSanitizer)
    : workspace.createdBy,
  workspaceRoles: workspace.workspaceRoles,
});
export type SanitizedWorkspace = ReturnType<typeof workspaceSanitizer>;

// ----------------- Workspace List -----------------
export const allWorkspaceSanitizer = (
  workspaces: IWorkspace[] | HydratedDocument<IWorkspace>[]
) => ({
  workspaces: workspaces.map(workspace => ({
    id: String(workspace._id),
    name: workspace.name,
    description: workspace.description,
  })),
});
export type SanitizedWorkspaces = ReturnType<typeof allWorkspaceSanitizer>;

// ----------------- Membership -----------------
export const membershipSanitizer = (membership: IMembership | HydratedDocument<IMembership>) => ({
  id: String(membership._id),
  workspaceRoles: membership.workspaceRoles,
  status: membership.status,
  user: membership.user ? resolveRef(membership.user, userSanitizer) : membership.user,
  workspace: membership.workspace
    ? resolveRef(membership.workspace, workspaceSanitizer)
    : membership.workspace,
  invitedBy: membership.invitedBy
    ? resolveRef(membership.invitedBy, userSanitizer)
    : membership.invitedBy,
});
export type SanitizedMembership = ReturnType<typeof membershipSanitizer>;

// ----------------- Workspace Invite -----------------
export const workspaceInviteSanitizer = (invite: IInvite | HydratedDocument<IInvite>) => ({
  id: String(invite._id),
  role: invite.role,
  status: invite.status,
  email: invite.email,
  token: invite.token,
});
export type SanitizedWorkspaceInvite = ReturnType<typeof workspaceInviteSanitizer>;

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
