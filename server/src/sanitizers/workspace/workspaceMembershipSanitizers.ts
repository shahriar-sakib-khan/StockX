import { HydratedDocument } from 'mongoose';

import { IInvite, IMembership } from '@/models/index.js';
import {
  resolveRef,
  listSanitizer,
  userSanitizer,
  workspaceSanitizer,
} from '@/sanitizers/index.js';

/**
 * ----------------- Membership -----------------
 */
export const membershipSanitizer = (membership: IMembership | HydratedDocument<IMembership>) => ({
  id: String(membership._id),
  workspaceRoles: membership.workspaceRoles ?? [],
  status: membership.status,
  user: resolveRef(membership.user ?? null, userSanitizer),
  workspace: resolveRef(membership.workspace ?? null, workspaceSanitizer),
  invitedBy: resolveRef(membership.invitedBy ?? null, userSanitizer),
});

export type SanitizedMembership = ReturnType<typeof membershipSanitizer>;

/**
 * ----------------- All Memberships -----------------
 */
export const allMembershipSanitizer = (
  memberships: IMembership[] | HydratedDocument<IMembership>[],
  fields?: (keyof SanitizedMembership)[]
) => ({
  memberships: listSanitizer(memberships, membershipSanitizer, fields),
});

export type SanitizedMemberships = ReturnType<typeof allMembershipSanitizer>;

/**
 * ----------------- Workspace Invite -----------------
 */
export const workspaceInviteSanitizer = (invite: IInvite | HydratedDocument<IInvite>) => ({
  id: String(invite._id),
  email: invite.email,
  role: invite.role,
  status: invite.status,
  token: invite.token,
  expiresAt: invite.expiresAt,
  workspace: resolveRef(invite.workspace ?? null, workspaceSanitizer),
  invitedBy: resolveRef(invite.invitedBy ?? null, userSanitizer),
  user: resolveRef(invite.user ?? null, userSanitizer),
});

export type SanitizedWorkspaceInvite = ReturnType<typeof workspaceInviteSanitizer>;

/**
 * ----------------- Workspace Invite List -----------------
 */
export const allWorkspaceInviteSanitizer = (
  invites: IInvite[] | HydratedDocument<IInvite>[],
  fields?: (keyof SanitizedWorkspaceInvite)[]
) => ({
  invites: listSanitizer(invites, workspaceInviteSanitizer, fields),
});

export type SanitizedWorkspaceInvites = ReturnType<typeof allWorkspaceInviteSanitizer>;
