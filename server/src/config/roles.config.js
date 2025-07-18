// roles.config.js

/**
 * Global super roles — platform-wide authority
 */
export const SUPER_ROLES = ['user', 'staff', 'ostad']; // 'ostad' = super-admin

/**
 * Workspace roles — scoped per workspace instance
 */
export const WORKSPACE_ROLES = [
  'user', // basic member
  'moderator', // can edit/manage content
  'manager', // higher privileges, e.g., user management
  'admin', // workspace owner, full workspace control
];

/**
 * Workspace status — scoped per workspace instance
 */
export const WORKSPACE_STATUS = ['active', 'invited', 'pending'];

/**
 * Permissions map per workspace role
 * Use "*" as wildcard to allow all permissions
 */
export const ROLE_PERMISSIONS = {
  user: ['read-self'], // can only read their own data
  moderator: ['read-any', 'edit-any'], // read and edit everything in workspace
  manager: ['read-any', 'edit-any', 'invite-users'], // can invite new members
  admin: ['*'], // full control over workspace
};

/**
 * Permissions map per superRole (global)
 */
export const SUPER_ROLE_PERMISSIONS = {
  user: ['read-self'],
  staff: ['read-any', 'edit-any', 'manage-workspaces'],
  ostad: ['*'], // super-admin, platform god mode
};
