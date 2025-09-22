/**
 * ----------------- Invite Status -----------------
 * Represents the current state of an invite
 */
export const InviteStatus = ['sent', 'pending', 'accepted', 'declined', 'expired'] as const;
export type InviteStatusType = (typeof InviteStatus)[number];

/**
 * ----------------- Invite Lifespan -----------------
 * Represents how long an invite remains valid
 *
 * Recommended default: '1d' (1 day)
 */
export const InviteLifespan = ['1h', '6h', '12h', '1d', '3d', '7d'] as const;
export type InviteLifespanType = (typeof InviteLifespan)[number];

/**
 * ----------------- Invite Expiration Map -----------------
 * Maps each lifespan key to its corresponding duration in milliseconds
 */
export const InviteExpirationMap: Record<InviteLifespanType, number> = {
  '1h': 60 * 60 * 1000, // 1 hour
  '6h': 6 * 60 * 60 * 1000, // 6 hours
  '12h': 12 * 60 * 60 * 1000, // 12 hours
  '1d': 24 * 60 * 60 * 1000, // 1 day
  '3d': 3 * 24 * 60 * 60 * 1000, // 3 days
  '7d': 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
