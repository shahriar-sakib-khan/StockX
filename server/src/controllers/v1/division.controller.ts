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
import { divisionService, divisionMembersService, divisionRolesService } from '@/services/v1';

// <============================> General Division Controllers <============================>

export const createDivision = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId } = req.params;

  const division = await divisionService.createDivision(req.body, userId, workspaceId);

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
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { divisionId, workspaceId } = req.params;

  const { members, total } = await divisionMembersService.getAllDivisionMembers(
    divisionId,
    workspaceId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({ total, page, limit, members });
};

export const getMember = async (req: Request, res: Response) => {
  const { memberId, divisionId, workspaceId } = req.params;

  const member = await divisionMembersService.getSingleDivisionMember(
    memberId,
    divisionId,
    workspaceId
  );

  res.status(StatusCodes.OK).json({ member });
};

export const addMember = async (req: Request, res: Response) => {
  assertAuth(req);

  const { userId } = req.user;
  const { workspaceId, divisionId } = req.params;
  const { memberIdentifier } = req.body;

  const member = await divisionMembersService.addMemberToDivision(
    memberIdentifier,
    workspaceId,
    divisionId,
    userId
  );

  res.status(StatusCodes.CREATED).json({ message: 'Member added successfully', member });
};

export const removeMember = async (req: Request, res: Response) => {
  const { workspaceId, divisionId } = req.params;
  const { memberIdentifier } = req.body;

  const member = await divisionMembersService.removeMemberFromDivision(
    memberIdentifier,
    workspaceId,
    divisionId
  );

  res.status(StatusCodes.OK).json({ message: 'Member removed successfully', member });
};

// <============================> Division Roles Controllers <============================>

export const getRoles = async (req: Request, res: Response) => {
  const { divisionId } = req.params;

  const roles = await divisionRolesService.getDivisionRoles(divisionId);

  const total = roles.length;

  res.status(StatusCodes.OK).json({ total, roles });
};

export const addRole = async (req: Request, res: Response) => {
  const { divisionId } = req.params;

  const divisionRoles = await divisionRolesService.addRoleToDivision(req.body, divisionId);

  const total = divisionRoles.length;

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Role added successfully', total, divisionRoles });
};

export const updateRole = async (req: Request, res: Response) => {
  const { roleId, divisionId } = req.params;
  const { roleToUpdate, divisionRoles } = await divisionRolesService.updateRoleInDivision(
    req.body,
    roleId,
    divisionId
  );

  const total = divisionRoles.length;

  res.status(StatusCodes.OK).json({
    message: `Role '${roleToUpdate.name}' was updated successfully`,
    total,
    divisionRoles,
  });
};

export const removeRole = async (req: Request, res: Response) => {
  const { roleId, divisionId } = req.params;
  const { roleToRemove, divisionRoles } = await divisionRolesService.removeRoleFromDivision(
    roleId,
    divisionId
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

  getRoles,
  addRole,
  updateRole,
  removeRole,

  assignRole,
  unassignRole,
};
