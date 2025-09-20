/**
 * Membership status — scoped per store instance
 */
export const MembershipStatus = ['active', 'removed'] as const;
export type MembershipStatusType = (typeof MembershipStatus)[number];