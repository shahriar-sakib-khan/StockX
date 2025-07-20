/**
 * Global super roles — platform-wide authority
 */
export const SUPER_ROLES = ['user', 'staff', 'ostad'] as const;
export type SuperRole = (typeof SUPER_ROLES)[number]; // "user" | "staff" | "ostad"

/**
 * Workspace roles — scoped per workspace instance
 */
export const WORKSPACE_ROLES = ['user', 'moderator', 'manager', 'admin'] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number]; // "user" | "moderator" | "manager" | "admin"

/**
 * Workspace status — scoped per workspace instance
 */
export const TENANT_STATUS = ['active', 'invited'] as const;
export type TenantStatus = (typeof TENANT_STATUS)[number]; // "active" | "invited" | "pending"

/**
 * Permissions map per workspace role
 * Use "*" as wildcard to allow all permissions
 */
export const ROLE_PERMISSIONS: Record<WorkspaceRole, string[]> = {
  user: ['read-self'],
  moderator: ['read-any', 'edit-any'],
  manager: ['read-any', 'edit-any', 'invite-users'],
  admin: ['*'],
};

/**
 * Permissions map per superRole (global)
 */
export const SUPER_ROLE_PERMISSIONS: Record<SuperRole, string[]> = {
  user: ['read-self'],
  staff: ['read-any', 'edit-any', 'manage-workspaces'],
  ostad: ['*'],
};
