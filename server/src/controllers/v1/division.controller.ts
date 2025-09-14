/**
 * @module DivisionController
 *
 * @description Controller for division related operations.
 *
 * General controllers:
 * - Create a new division
 * - Get a single division by ID
 * - Get all divisions
 * - Delete a division
 * - Update a division
 *
 * Members controller:
 * - Get a list of division members
 * - Add a member to a division
 * - Remove a member from a division
 *
 * Roles controller:
 * - Get a list of division roles
 * - Add a role to a division
 * - Remove a role from a division
 * - Update a role in a division
 *
 * Role Assignments controller:
 * - Assign a role to a member
 * - Remove a role from a member
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';
import { divisionService, divisionMembersService, divisionRolesService } from '@/services/v1/index.js';
import { seedBaseTxCategories, seedBaseAccounts, seedLocalBrands } from '@/bootstrap/index.js';

// <============================> General Division Controllers <============================>

export const createDivision = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId } = req.params;

  const division = await divisionService.createDivision(req.body, userId, workspaceId);

  // Create local brands from global brands with inactive status for selection
  await seedLocalBrands(workspaceId, division.id, userId);
  await seedBaseTxCategories(workspaceId, division.id);
  await seedBaseAccounts(workspaceId, division.id);

  res.status(StatusCodes.CREATED).json({ message: 'Division created successfully', division });
};

export const singleDivision = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const division = await divisionService.getSingleDivision(workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ division });
};

export const updateDivision = async (req: Request, res: Response) => {
  const { divisionId } = req.params;

  const division = await divisionService.updateDivision(req.body, divisionId);

  res.status(StatusCodes.OK).json({ message: 'Division updated successfully', division });
};

export const deleteDivision = async (req: Request, res: Response) => {
  const { divisionId } = req.params;

  const division = await divisionService.deleteDivision(divisionId);

  res.status(StatusCodes.OK).json({ message: 'Division deleted successfully', division });
};

export const allDivisions = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { workspaceId } = req.params;

  const { divisions, total } = await divisionService.getAllDivisions(workspaceId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, divisions });
};

export const myDivisionProfile = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId } = req.params;

  const divisionProfile = await divisionService.getMyDivisionProfile(
    userId,
    divisionId,
    workspaceId
  );

  res.status(StatusCodes.OK).json({ divisionProfile });
};

// <============================> Division Members Controllers <============================>

export const allMembers = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { members, total } = await divisionMembersService.getAllDivisionMembers(
    page,
    limit,
    workspaceId,
    divisionId
  );

  res.status(StatusCodes.OK).json({ total, page, limit, members });
};

export const getMember = async (req: Request, res: Response) => {
  const { memberId, divisionId, workspaceId } = req.params;

  const member = await divisionMembersService.getSingleDivisionMember(
    workspaceId,
    divisionId,
    memberId
  );

  res.status(StatusCodes.OK).json({ member });
};

export const addMember = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId, memberId } = req.params;

  const member = await divisionMembersService.addMemberToDivision(
    userId,
    workspaceId,
    divisionId,
    memberId
  );

  res.status(StatusCodes.CREATED).json({ message: 'Member added successfully', member });
};

export const removeMember = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, divisionId, memberId } = req.params;

  const member = await divisionMembersService.removeMemberFromDivision(
    userId,
    workspaceId,
    divisionId,
    memberId
  );

  res.status(StatusCodes.OK).json({ message: 'Member removed successfully', member });
};

// <============================> Role Assignment Controllers <============================>

export const assignRole = async (req: Request, res: Response) => {
  const { roleId, userId, workspaceId, divisionId } = req.params;

  const divisionMember = await divisionRolesService.assignRoleToUser(
    roleId,
    userId,
    divisionId,
    workspaceId
  );

  res.status(StatusCodes.CREATED).json({ message: 'Role assigned successfully', divisionMember });
};

export const unassignRole = async (req: Request, res: Response) => {
  const { roleId, userId, workspaceId, divisionId } = req.params;

  const divisionMember = await divisionRolesService.unassignRoleFromUser(
    roleId,
    userId,
    divisionId,
    workspaceId
  );

  res.status(StatusCodes.OK).json({ message: 'Role unassigned successfully', divisionMember });
};

// <============================> Division Roles Controllers <============================>

export const getRoles = async (req: Request, res: Response) => {
  const { divisionId } = req.params;

  const { roles } = await divisionRolesService.getDivisionRoles(divisionId);

  const total = roles.length;

  res.status(StatusCodes.OK).json({ total, divisionRoles: roles });
};

export const addRole = async (req: Request, res: Response) => {
  const { divisionId } = req.params;

  const divisionRoles = await divisionRolesService.addRoleToDivision(req.body, divisionId);

  res.status(StatusCodes.CREATED).json({
    message: 'Role added successfully',
    divisionRoles,
  });
};

export const updateRole = async (req: Request, res: Response) => {
  const { roleId, divisionId } = req.params;

  const { roleToUpdate, divisionRoles } = await divisionRolesService.updateRoleInDivision(
    req.body,
    roleId,
    divisionId
  );

  res.status(StatusCodes.OK).json({
    message: `Role '${roleToUpdate.name}' was updated successfully`,
    divisionRoles,
  });
};

export const removeRole = async (req: Request, res: Response) => {
  const { roleId, divisionId } = req.params;

  const divisionRoles = await divisionRolesService.removeRoleFromDivision(roleId, divisionId);

  res.status(StatusCodes.OK).json({
    message: `Role was removed successfully`,
    divisionRoles,
  });
};

// <============================> Default Export <============================>

export default {
  createDivision,
  singleDivision,
  updateDivision,
  deleteDivision,
  allDivisions,
  myDivisionProfile,

  allMembers,
  getMember,
  addMember,
  removeMember,

  assignRole,
  unassignRole,

  getRoles,
  addRole,
  updateRole,
  removeRole,
};
