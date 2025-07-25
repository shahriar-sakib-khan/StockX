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

import { assertAuth } from '@/common/assertions';
import { divisionService, divisionMembersService, divisionRolesService } from '@/services/v1/index';

// <============================> General Division Controllers <============================>

export const createDivision = async (req: Request, res: Response) => {
  assertAuth(req);
  const division = await divisionService.createDivision(
    req.body,
    req.params.workspaceId,
    req.user.userId
  );

  res.status(StatusCodes.CREATED).json({ message: 'Division created successfully', division });
};

export const singleDivision = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const division = await divisionService.getSingleDivision(workspaceId, divisionId);

  res.status(StatusCodes.OK).json({ division });
};

export const updateDivision = async (req: Request, res: Response) => {
  const division = await divisionService.updateDivision(req.body, req.params.divisionId);

  res.status(StatusCodes.OK).json({ message: 'Division updated successfully', division });
};

export const deleteDivision = async (req: Request, res: Response) => {
  const division = await divisionService.deleteDivision(req.params.divisionId);

  res.status(StatusCodes.OK).json({ message: 'Division deleted successfully', division });
};

export const allDivisions = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const divisions = await divisionService.getAllDivisions(req.params.workspaceId, page, limit);

  const totalDivisions = divisions.length;

  res.status(StatusCodes.OK).json({ totalDivisions, page, limit, divisions });
};

// <============================> Division Members Controllers <============================>

export const getMembers = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const members = await divisionMembersService.getDivisionMembers(
    req.params.divisionId,
    req.params.workspaceId,
    page,
    limit
  );

  const totalMembers = members.length;

  res.status(StatusCodes.OK).json({ totalMembers, page, limit, members });
};

export const addMember = async (req: Request, res: Response) => {
  assertAuth(req);
  const member = await divisionMembersService.addMemberToDivision(
    req.body.memberId,
    req.params.workspaceId,
    req.params.divisionId,
    req.user.userId
  );

  res.status(StatusCodes.CREATED).json({ message: 'Member added successfully', member });
};

export const removeMember = async (req: Request, res: Response) => {
  assertAuth(req);
  const member = await divisionMembersService.removeMemberFromDivision(
    req.body.memberId,
    req.params.workspaceId,
    req.params.divisionId,
    req.user.userId
  );

  res.status(StatusCodes.OK).json({ message: 'Member removed successfully', member });
};

// <============================> Division Roles Controllers <============================>

export const getRoles = async (req: Request, res: Response) => {
  const roles = await divisionRolesService.getDivisionRoles(req.params.divisionId);

  const totalRoles = roles.length;

  res.status(StatusCodes.OK).json({ totalRoles, roles });
};

export const addRole = async (req: Request, res: Response) => {
  assertAuth(req);
  const divisionRoles = await divisionRolesService.addRoleToDivision(
    req.body,
    req.params.workspaceId,
    req.params.divisionId
  );

  const totalDivisionRoles = divisionRoles.length;

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Role added successfully', totalDivisionRoles, divisionRoles });
};

export const updateRole = async (req: Request, res: Response) => {
  const { roleId, workspaceId, divisionId } = req.params;
  const { roleToUpdate, divisionRoles } = await divisionRolesService.updateRoleInDivision(
    req.body,
    roleId,
    divisionId,
    workspaceId
  );

  const totalDivisionRoles = divisionRoles.length;

  res.status(StatusCodes.OK).json({
    message: `Role '${roleToUpdate.name}' was updated successfully`,
    totalDivisionRoles,
    divisionRoles,
  });
};

export const removeRole = async (req: Request, res: Response) => {
  const { roleId, workspaceId, divisionId } = req.params;
  const { roleToRemove, divisionRoles } = await divisionRolesService.removeRoleFromDivision(
    roleId,
    divisionId,
    workspaceId
  );

  const totalDivisionRoles = divisionRoles.length;

  res.status(StatusCodes.OK).json({
    message: `Role '${roleToRemove.name}' was removed successfully`,
    totalDivisionRoles,
    divisionRoles,
  });
};

// <============================> Role Assignment Controllers <============================>

export const assignRole = async (req: Request, res: Response) => {
  const { roleId } = req.body;
  const { userId, workspaceId, divisionId } = req.params;

  const divisionMembership = await divisionRolesService.assignRoleToUser(
    roleId,
    userId,
    divisionId,
    workspaceId
  );

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Role assigned successfully', divisionMembership });
};

export const unassignRole = async (req: Request, res: Response) => {
  const { roleId, userId, workspaceId, divisionId } = req.params;

  const divisionMembership = await divisionRolesService.unassignRoleFromUser(
    roleId,
    userId,
    divisionId,
    workspaceId
  );

  res.status(StatusCodes.OK).json({ message: 'Role unassigned successfully', divisionMembership });
};

// <============================> Default Export <============================>

export default {
  createDivision,
  singleDivision,
  updateDivision,
  deleteDivision,
  allDivisions,

  getMembers,
  addMember,
  removeMember,

  getRoles,
  addRole,
  updateRole,
  removeRole,

  assignRole,
  unassignRole,
};
