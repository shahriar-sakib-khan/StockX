/**
 * Local Staff Roles
 * Ordered by privilege (highest to lowest) for hierarchy checks.
 */
export const StaffRoles = ['admin', 'manager', 'cashier', 'driver', 'staff'] as const;
export type StaffRoleType = (typeof StaffRoles)[number];

/**
 * Maps roles to a numeric level for easy comparison.
 * Lower number = Higher privilege.
 */
export const StaffRoleLevels: Record<StaffRoleType, number> = {
  admin: 1, // Can manage managers & below
  manager: 2, // Can manage cashiers/drivers/staff
  cashier: 3,
  driver: 3,
  staff: 3,
};

/**
 * Permissions Map (Optional, for granular checks later)
 */
export const RolePermissions: Record<StaffRoleType, string[]> = {
  admin: ['view_dashboard', 'manage_staff', 'manage_inventory', 'view_reports'],
  manager: ['view_dashboard', 'manage_inventory', 'manage_staff_limited'], // limited = only lower tiers
  cashier: ['create_sale'],
  driver: ['view_deliveries'],
  staff: [],
};
