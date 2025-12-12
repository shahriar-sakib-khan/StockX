/**
 * ----------------- Invite Status -----------------
 */
export const InviteStatus = ['sent', 'pending', 'accepted', 'declined', 'expired'] as const;
export type InviteStatusType = (typeof InviteStatus)[number];

/**
 * ----------------- Invite Lifespan -----------------
 */
export const InviteLifespan = ['1h', '6h', '12h', '1d', '3d', '7d'] as const;
export type InviteLifespanType = (typeof InviteLifespan)[number];

/**
 * ----------------- Invite Expiration Map -----------------
 */
export const InviteExpirationMap: Record<InviteLifespanType, number> = {
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * ----------------- Invite Roles -----------------
 * RESTRICTED: Only Global Roles for Co-Owners/Partners.
 * Local staff are created directly in the Staff Module.
 */
export const InviteRoles = ['owner', 'admin'] as const;
export type InviteRoleType = (typeof InviteRoles)[number];
