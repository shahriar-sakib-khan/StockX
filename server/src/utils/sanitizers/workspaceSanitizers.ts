import { HydratedDocument } from 'mongoose';

import resolveRef from './resolveRef';
import { IMembership, IWorkspace, IInvite } from '@/models';
import { userSanitizer } from './userSanitizers';

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
