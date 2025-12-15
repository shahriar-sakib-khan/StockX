/**
 * @module store.constants
 * @description Configuration for Store roles and permissions.
 */

export const DefaultStoreRoles = [
  { name: 'owner', permissions: ['*'] },
  { name: 'admin', permissions: ['manage_store', 'assign_roles'] },
  { name: 'manager', permissions: ['manage_store', 'assign_roles'] },
  { name: 'staff', permissions: [] },
  { name: 'driver', permissions: [] },
] as const;

export type StoreRoleType = (typeof DefaultStoreRoles)[number]['name'];
