/**
 * Workspace Invite status
 */
export const InviteStatus = ['sent', 'pending', 'accepted', 'declined', 'expired'] as const;
export type InviteStatusType = (typeof InviteStatus)[number];

/**
 * Workspace membership status — scoped per workspace instance
 */
export const WorkspaceMembershipStatuses = ['active', 'invited'] as const;
export type WorkspaceMembershipStatusType = (typeof WorkspaceMembershipStatuses)[number]; // "active" | "invited" | "pending"

/**
 * Division membership status — scoped per division instance
 */
export const DivisionMembershipStatuses = ['active', 'removed'] as const;
export type DivisionMembershipStatusType = (typeof DivisionMembershipStatuses)[number];
