/**
 * @module divisionRoles.service
 *
 * @description Services for managing roles within a specific division.
 * Handles adding, updating, removing, and assigning roles to users.
 */

import { Types } from 'mongoose';

import { Division, DivisionMembership } from '@/models/index.js';
import { division } from '@/validations/index.js';
import { divisionMembershipSanitizers, roleSanitizers } from '@/sanitizers/index.js';
import { Errors } from '@/error/index.js';

/**
 * @function getDivisionRoles
 * @description Get all roles for a division.
 *
 * @param {string} divisionId - The ID of the division to retrieve roles for.
 * @returns {Promise<roleSanitizers.SanitizedRoles>} Sanitized roles list.
 * @throws {NotFoundError} If division not found.
 */
const getDivisionRoles = async (divisionId: string): Promise<roleSanitizers.SanitizedRoles> => {
  const divisionDoc = await Division.findById(divisionId).select('divisionRoles').lean();
  if (!divisionDoc) throw new Errors.NotFoundError('Division not found');

  return roleSanitizers.allRolesSanitizer(
    divisionDoc.divisionRoles as unknown as roleSanitizers.IRole[]
  );
};

/**
 * @function addRoleToDivision
 * @description Add a new role to a division.
 *
 * @param {division.divisionRoleInputSchema} roleData - Role creation data.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<roleSanitizers.SanitizedRoles>} Updated roles list with total count.
 * @throws {NotFoundError} If division not found.
 */
const addRoleToDivision = async (
  roleData: division.DivisionRoleInput,
  divisionId: string
): Promise<roleSanitizers.SanitizedRoles> => {
  const { name, permissions } = roleData;

  const divisionDoc = await Division.findById(divisionId);
  if (!divisionDoc) throw new Errors.NotFoundError('Division not found');

  // Check for duplicate role name
  const isDuplicate = divisionDoc.divisionRoles.some(
    role => role.name.toLowerCase() === name.toLowerCase()
  );
  if (isDuplicate) throw new Errors.BadRequestError('Role with this name already exists');

  divisionDoc.divisionRoles.push({
    name,
    permissions: permissions ?? [],
    _id: new Types.ObjectId(),
  });

  await divisionDoc.save();

  return roleSanitizers.allRolesSanitizer(
    divisionDoc.divisionRoles as unknown as roleSanitizers.IRole[]
  );
};

/**
 * @function updateRoleInDivision
 * @description Update an existing role's name or permissions in a division.
 *
 * @param {division.divisionRoleInputSchema} roleData - Role update data.
 * @param {string} divisionId - Division ID.
 * @param {string} roleId - Role ID.
 * @returns {Promise<{ roleToUpdate: SanitizedRole; divisionRoles: SanitizedRoles;}>} Updated role and full list.
 * @throws {NotFoundError} If division or role not found.
 */
const updateRoleInDivision = async (
  roleData: division.DivisionRoleInput,
  divisionId: string,
  roleId: string
): Promise<{
  roleToUpdate: roleSanitizers.SanitizedRole;
  divisionRoles: roleSanitizers.SanitizedRoles;
}> => {
  const divisionDoc = await Division.findById(divisionId);
  if (!divisionDoc) throw new Errors.NotFoundError('Division not found');

  const role = divisionDoc.divisionRoles.find(r => r?._id?.equals(roleId));
  if (!role) throw new Errors.NotFoundError('Role not found');

  // Validate duplicate name if updating role name
  if (roleData.name && roleData.name !== role.name) {
    const duplicate = divisionDoc.divisionRoles.some(
      r => r.name.toLowerCase() === roleData.name.toLowerCase() && !r._id?.equals(roleId)
    );
    if (duplicate) throw new Errors.BadRequestError('Another role with this name already exists');
  }

  role.name = roleData.name ?? role.name;
  role.permissions = roleData.permissions ?? role.permissions;

  await divisionDoc.save();

  return {
    roleToUpdate: roleSanitizers.roleSanitizer(role as unknown as roleSanitizers.IRole),
    divisionRoles: roleSanitizers.allRolesSanitizer(
      divisionDoc.divisionRoles as unknown as roleSanitizers.IRole[]
    ),
  };
};

/**
 * @function removeRoleFromDivision
 * @description Remove a role from a division.
 *
 * @param {string} roleId - Role ID to remove.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<SanitizedRoles>} Removed role and updated list.
 * @throws {Error} If division or role not found.
 */
const removeRoleFromDivision = async (
  roleId: string,
  divisionId: string
): Promise<roleSanitizers.SanitizedRoles> => {
  const divisionDoc = await Division.findByIdAndUpdate(divisionId, {
    $pull: { divisionRoles: { _id: roleId } },
  })
    .select('divisionRoles')
    .lean();

  if (!divisionDoc) throw new Errors.NotFoundError('Division not found');

  return roleSanitizers.allRolesSanitizer(
    divisionDoc.divisionRoles as unknown as roleSanitizers.IRole[]
  );
};

/**
 * @function assignRoleToUser
 * @description Assign a role to a division member.
 *
 * @param {string} roleId - Role ID to assign.
 * @param {string} userId - User ID to assign the role to.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<SanitizedDivisionMembership>} Updated division membership document.
 * @throws {Error} If division membership not found or role already assigned.
 */
const assignRoleToUser = async (
  roleId: string,
  userId: string,
  workspaceId: string,
  divisionId: string
): Promise<divisionMembershipSanitizers.SanitizedDivisionMembership> => {
  const membership = await DivisionMembership.findOne({
    user: userId,
    workspace: workspaceId,
    division: divisionId,
  })
    .populate('user', 'username email')
    .populate('division', 'name')
    .populate('workspace', 'name');

  if (!membership) throw new Errors.NotFoundError('Not a member of division');

  const divisionDoc = await Division.findById(divisionId).select('divisionRoles').lean();
  if (!divisionDoc) throw new Errors.NotFoundError('Division not found');

  const role = divisionDoc.divisionRoles.find(r => r._id?.toString() === roleId);
  if (!role) throw new Errors.BadRequestError('Invalid role');

  const roleName = role.name;

  if (membership.divisionRoles.includes(roleName))
    throw new Errors.BadRequestError('Role already assigned');

  membership.divisionRoles.push(roleName);
  await membership.save();

  return divisionMembershipSanitizers.divisionMembershipSanitizer(membership);
};

/**
 * @function unassignRoleFromUser
 * @description Remove a role from a division member.
 *
 * @param {string} roleId - Role ID to unassign.
 * @param {string} userId - User ID to unassign from.
 * @param {string} workspaceId - Workspace ID.
 * @param {string} divisionId - Division ID.
 * @returns {Promise<SanitizedDivisionMembership>} Updated division membership document.
 * @throws {Error} If division membership not found or role not assigned.
 */
const unassignRoleFromUser = async (
  roleId: string,
  userId: string,
  workspaceId: string,
  divisionId: string
): Promise<divisionMembershipSanitizers.SanitizedDivisionMembership> => {
  const membership = await DivisionMembership.findOne({
    user: userId,
    workspace: workspaceId,
    division: divisionId,
  })
    .populate('user', 'username email')
    .populate('division', 'name')
    .populate('workspace', 'name');

  if (!membership) throw new Errors.NotFoundError('Not a member of division');

  const divisionDoc = await Division.findById(divisionId).select('divisionRoles').lean();
  if (!divisionDoc) throw new Errors.NotFoundError('Division not found');

  const role = divisionDoc.divisionRoles.find(r => r._id?.toString() === roleId);
  if (!role) throw new Errors.BadRequestError('Invalid role');

  const roleName = role.name;

  if (!membership.divisionRoles.includes(roleName))
    throw new Errors.BadRequestError('Role not assigned');

  membership.divisionRoles = membership.divisionRoles.filter(r => r !== roleName);
  await membership.save();

  return divisionMembershipSanitizers.divisionMembershipSanitizer(membership);
};

/**
 * ----------------- Division Roles Service (default export) -----------------
 */
export default {
  getDivisionRoles,
  addRoleToDivision,
  updateRoleInDivision,
  removeRoleFromDivision,

  assignRoleToUser,
  unassignRoleFromUser,
};
