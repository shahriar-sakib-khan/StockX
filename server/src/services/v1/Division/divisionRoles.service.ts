import { HydratedDocument } from 'mongoose';

import { Division, DivisionMembership, IDivision, IDivisionMembership } from '@/models';
import { Errors } from '@/error';
import e from 'express';

/**
 * @function getDivisionRoles
 * @description Get all roles for a division.
 *
 * @param {string} divisionId - The ID of the division to retrieve roles for.
 * @returns {Promise<{ name: string; permissions: string[] }[]>} An array of role objects.
 */
export const getDivisionRoles = async (
  divisionId: string
): Promise<{ name: string; permissions: string[] }[]> => {
  const division = await Division.findById(divisionId).select('divisionRoles').lean();

  return division?.divisionRoles ?? [];
};

/**
 * @function addRoleToDivision
 * @description Add a role to a division.
 *
 * @param {{ name: string; permissions: string[] }} role - The name of the role to add.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @param {string} divisionId - The ID of the division to add the role to.
 * @returns {Promise<{ name: string; permissions: string[]}[] >} The updated division document.
 */
export const addRoleToDivision = async (
  role: { name: string; permissions: string[] },
  workspaceId: string,
  divisionId: string
): Promise<{ name: string; permissions: string[] }[]> => {
  const division = await Division.findOne({
    _id: divisionId,
    workspace: workspaceId,
  }).select('divisionRoles');

  if (!division) throw new Error('Division not found');

  if (division.divisionRoles.find(r => r.name === role.name))
    throw new Error('Role already exists');

  division.divisionRoles.push(role);
  division.save();

  return division.divisionRoles;
};

/**
 * @function updateRoleInDivision
 * @description Update a role in a division.
 *
 * @param {{ name: string; permissions: string[] }} role - The name of the role to update.
 * @param {string} roleId - The ID of the role to update.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @param {string} divisionId - The ID of the division to update the role in.
 * @returns {Promise<{ name: string; permissions: string[]}, { name: string; permissions: string[] }[] >} The updated division document.
 */
export const updateRoleInDivision = async (
  role: { name: string; permissions: string[] },
  roleId: string,
  divisionId: string,
  workspaceId: string
): Promise<{
  roleToUpdate: { name: string; permissions: string[] };
  divisionRoles: { name: string; permissions: string[] }[];
}> => {
  const division = await Division.findOne({
    _id: divisionId,
    workspace: workspaceId,
  }).select('divisionRoles');

  if (!division) throw new Error('Division not found');

  const roleToUpdate = division.divisionRoles.find(r => r._id?.toString() === roleId);

  if (!roleToUpdate) throw new Error('Role not found');

  if (role.name) roleToUpdate.name = role.name;
  if (role.permissions) roleToUpdate.permissions = role.permissions;
  division.save();

  return { roleToUpdate, divisionRoles: division.divisionRoles };
};

/**
 * @function removeRoleFromDivision
 * @description Remove a role from a division.
 *
 * @param {string} roleId - The name of the role to remove.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @param {string} divisionId - The ID of the division to remove the role from.
 * @returns {Promise<{ name: string; permissions: string[]}, { name: string; permissions: string[] }[] >} The updated division document.
 */
export const removeRoleFromDivision = async (
  roleId: string,
  divisionId: string,
  workspaceId: string
): Promise<{
  roleToRemove: { name: string; permissions: string[] };
  divisionRoles: { name: string; permissions: string[] }[];
}> => {
  const division = await Division.findOne({
    _id: divisionId,
    workspace: workspaceId,
  }).select('divisionRoles');

  if (!division) throw new Error('Division not found');

  const roleToRemove = division.divisionRoles.find(r => r._id?.toString() === roleId);

  if (!roleToRemove) throw new Error('Role not found');

  division.divisionRoles = division.divisionRoles.filter(r => r._id?.toString() !== roleId);
  division.save();

  return { roleToRemove, divisionRoles: division.divisionRoles };
};

/**
 * @function assignRoleToUser
 * @description Assign a role to a user.
 *
 * @param {string} roleId - The ID of the role to assign.
 * @param {string} userId - The ID of the user to assign the role to.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @param {string} divisionId - The ID of the division to assign the role to.
 * @returns {Promise<HydratedDocument<IDivisionMembership> & { division: IDivision }>} The updated division membership document.
 */
export const assignRoleToUser = async (
  roleId: string,
  userId: string,
  divisionId: string,
  workspaceId: string
): Promise<HydratedDocument<IDivisionMembership>> => {
  const divisionMembership = await DivisionMembership.findOne({
    user: userId,
    workspace: workspaceId,
    division: divisionId,
  }).populate<{ division: IDivision }>('division', 'divisionRoles');

  if (!divisionMembership) throw new Error('Division membership not found');

  const isValidRole = divisionMembership.division.divisionRoles.some(role => role.name === roleId);
  if (!isValidRole) throw new Errors.BadRequestError('Invalid role');

  if (!divisionMembership.divisionRoles.includes(roleId)) {
    divisionMembership.divisionRoles.push(roleId);
    await divisionMembership.save();
  }

  return divisionMembership as HydratedDocument<IDivisionMembership & { division: IDivision }>;
};

/**
 * @function unassignRoleFromUser
 * @description Unassign a role from a user.
 *
 * @param {string} roleId - The ID of the role to unassign.
 * @param {string} userId - The ID of the user to unassign the role from.
 * @param {string} workspaceId - The ID of the workspace the division is in.
 * @returns {Promise<HydratedDocument<IDivisionMembership>>} The updated division membership document.
 */
export const unassignRoleFromUser = async (
  roleId: string,
  userId: string,
  divisionId: string,
  workspaceId: string
): Promise<HydratedDocument<IDivisionMembership>> => {
  const divisionMembership = await DivisionMembership.findOne({
    user: userId,
    division: divisionId,
    workspace: workspaceId,
  });

  if (!divisionMembership) throw new Error('Division membership not found');

  const division = await Division.findOne({
    _id: divisionId,
    workspace: workspaceId,
  }).select('divisionRoles');

  if (!division) throw new Error('Division not found');

  const isValidRole = division.divisionRoles.find(r => r._id?.toString() === roleId);
  if (!isValidRole) throw new Errors.BadRequestError('Invalid role');

  const roleToRemove = isValidRole.name;

  if (divisionMembership.divisionRoles.includes(roleToRemove)) {
    divisionMembership.divisionRoles = divisionMembership.divisionRoles.filter(role => role !== roleToRemove);
    await divisionMembership.save();
  } else throw new Error('Member does not have this role');

  return divisionMembership;
};
// <============================> Exports <============================>

export default {
  getDivisionRoles,
  addRoleToDivision,
  updateRoleInDivision,
  removeRoleFromDivision,

  assignRoleToUser,
  unassignRoleFromUser,
};
