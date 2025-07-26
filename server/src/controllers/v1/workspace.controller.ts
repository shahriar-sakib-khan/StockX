/**
 * Workspace Controller
 *
 * Handles all logic for workspace CRUD, members, invites, roles, and role assignments.
 *
 * @module controllers/workspace
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { workspaceService, membersService, rolesService, invitesService } from '@/services/v1';
import { assertAuth } from '@/common/assertions';

// ---------------------------
// Workspace CRUD
// ---------------------------

export const createWorkspace = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const workspace = await workspaceService.createWorkspace(req.body, userId);

  res.status(StatusCodes.CREATED).json({
    message: 'Workspace created successfully',
    workspace,
  });
};

export const myWorkspaces = async (req: Request, res: Response) => {
  assertAuth(req);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { userId } = req.user;

  const { workspaces, total } = await workspaceService.getAllWorkspaces(userId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, workspaces });
};

export const singleWorkspace = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const workspace = await workspaceService.getSingleWorkspace(workspaceId);

  res.status(StatusCodes.OK).json({ workspace });
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const workspace = await workspaceService.updateWorkspace(req.body, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Workspace updated successfully',
    workspace,
  });
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const workspace = await workspaceService.deleteWorkspace(workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Workspace deleted successfully',
    workspace,
  });
};

export const myWorkspaceProfile = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId } = req.params;

  const workspaceProfile = await workspaceService.getMyWorkspaceProfile(userId, workspaceId);

  res.status(StatusCodes.OK).json({ workspaceProfile });
};

// ---------------------------
// Workspace Members
// ---------------------------

export const allMembers = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { workspaceId } = req.params;

  const { members, total } = await membersService.getAllWorkspaceMembers(workspaceId, page, limit);

  res.status(StatusCodes.OK).json({
    total,
    page,
    limit,
    workspaceMembers: members,
  });
};

export const getMember = async (req: Request, res: Response) => {
  const { workspaceId, memberId } = req.params;

  const member = await membersService.getWorkspaceMember(workspaceId, memberId);

  res.status(StatusCodes.OK).json({ member });
};

export const removeMember = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, memberId } = req.params;

  const member = await membersService.removeWorkspaceMember(userId, workspaceId, memberId);

  res.status(StatusCodes.OK).json({
    message: 'Member removed successfully',
    member,
  });
};

// ---------------------------
// Workspace Invites
// ---------------------------

export const sendInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspace } = req.membership;

  const invite = await invitesService.sendWorkspaceInvite(req.body, userId, workspace);

  res.status(StatusCodes.OK).json({
    message: 'Invite sent successfully',
    invite,
  });
};

export const acceptInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;

  const invite = await invitesService.acceptWorkspaceInvite(req.params.token, userId);

  res.status(StatusCodes.OK).json({
    message: 'Invite accepted successfully',
    invite,
  });
};

export const declineInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { token } = req.params;

  const invite = await invitesService.declineWorkspaceInvite(token, userId);

  res.status(StatusCodes.OK).json({
    message: 'Invite declined successfully',
    invite,
  });
};

export const allInvites = async (req: Request, res: Response) => {
  assertAuth(req);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const { workspace } = req.membership;

  const { SanitizedWorkspaceInvites: allInvites, total } = await invitesService.getAllInvites(
    workspace,
    page,
    limit
  );

  res.status(StatusCodes.OK).json({ total, page, limit, allInvites });
};

export const deleteInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { token } = req.params;

  const invite = await invitesService.deleteWorkspaceInvite(token);

  res.status(StatusCodes.OK).json({
    message: 'Invitation deleted successfully',
    invite,
  });
};

// ---------------------------
// Workspace Roles
// ---------------------------

export const allRoles = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const workspaceRoles = await rolesService.getWorkspaceRoles(workspaceId);
  const totalRoles = workspaceRoles.length;

  res.status(StatusCodes.OK).json({ totalRoles, workspaceRoles });
};

export const addRole = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const workspaceRoles = await rolesService.addWorkspaceRole(req.body, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role added successfully',
    workspaceRoles,
  });
};

export const updateRole = async (req: Request, res: Response) => {
  const { workspaceId, roleId } = req.params;

  const workspaceRoles = await rolesService.updateWorkspaceRole(req.body, roleId, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role updated successfully',
    workspaceRoles,
  });
};

export const removeRole = async (req: Request, res: Response) => {
  const { workspaceId, roleId } = req.params;

  const workspaceRoles = await rolesService.removeWorkspaceRole(roleId, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role removed successfully',
    workspaceRoles,
  });
};

export const assignRole = async (req: Request, res: Response) => {
  const { userId, roleId, workspaceId } = req.params;

  const membership = await rolesService.assignRoleToUser(userId, roleId, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role assigned successfully',
    membership,
  });
};

export const unassignRole = async (req: Request, res: Response) => {
  const { userId, roleId, workspaceId } = req.params;

  const membership = await rolesService.unassignRoleFromUser(userId, roleId, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role unassigned successfully',
    membership,
  });
};

// ---------------------------
// Exports
// ---------------------------

export default {
  createWorkspace,
  myWorkspaces,
  singleWorkspace,
  updateWorkspace,
  deleteWorkspace,
  myWorkspaceProfile,

  allMembers,
  getMember,
  removeMember,

  sendInvite,
  acceptInvite,
  declineInvite,
  allInvites,
  deleteInvite,

  allRoles,
  addRole,
  updateRole,
  removeRole,

  assignRole,
  unassignRole,
};
