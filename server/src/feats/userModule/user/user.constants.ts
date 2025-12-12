/**
 * Global user roles — platform-wide authority
 */
export const UserRoles = ['user', 'staff', 'admin', 'ostad'] as const;
export type UserRoleType = (typeof UserRoles)[number];
