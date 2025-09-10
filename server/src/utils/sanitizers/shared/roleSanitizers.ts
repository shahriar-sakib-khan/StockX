import { listSanitizer } from '@/utils/sanitizers';

/**
 * ----------------- Generic Role Interface -----------------
 */
export interface IRole {
  _id: string;
  name: string;
  permissions: string[];
}

/**
 * ----------------- Single Role Sanitizer -----------------
 */
export const roleSanitizer = (role: IRole) => ({
  id: role._id,
  name: role.name,
  permissions: role.permissions ?? [],
});

export type SanitizedRole = ReturnType<typeof roleSanitizer>;

/**
 * ----------------- Roles List Sanitizer -----------------
 * Optional field selection supported
 */
export const allRolesSanitizer = (roles: IRole[], fields?: (keyof SanitizedRole)[]) => ({
  roles: listSanitizer(roles, roleSanitizer, fields),
});

export type SanitizedRoles = ReturnType<typeof allRolesSanitizer>;
