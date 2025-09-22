import { HydratedDocument } from 'mongoose';

import { resolveRef, listSanitizer, userSanitizer, storeSanitizer } from '@/sanitizers/index.js';

import { IInvite } from './index.js';

/**
 * ----------------- Invite -----------------
 */
export const inviteSanitizer = (invite: IInvite | HydratedDocument<IInvite>) => ({
  id: String(invite._id),
  store: resolveRef(invite.store, storeSanitizer),
  email: invite.email,
  user: resolveRef(invite.user ?? null, userSanitizer),
  role: invite.role,
  status: invite.status,
  token: invite.token,
  invitedBy: resolveRef(invite.invitedBy, userSanitizer),
  lifespan: invite.lifespan,
  expiresAt: invite.expiresAt,
  createdAt: invite.createdAt,
  updatedAt: invite.updatedAt,
});

export type SanitizedInvite = ReturnType<typeof inviteSanitizer>;

/**
 * ----------------- Invite List -----------------
 * Can optionally select only specific fields
 */
export const allInviteSanitizer = (
  invites: IInvite[] | HydratedDocument<IInvite>[],
  fields?: (keyof SanitizedInvite)[]
) => ({
  invites: listSanitizer(invites, inviteSanitizer, fields),
});

export type SanitizedInvites = ReturnType<typeof allInviteSanitizer>;
