/**
 * ----------------- Workspace Controller -----------------
 *
 * Handles all logic for workspace CRUD, members, invites, roles, and role assignments.
 *
 * @module controllers/workspace
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { workspaceService, memberService, roleService, inviteService } from '@/services/v1/index.js';
import { assertAuth } from '@/common/index.js';

/**
 * ----------------- Workspace CRUD -----------------
 */

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
  const { userId } = req.user;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

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

/**
 * ----------------- Workspace Invites -----------------
 */

export const sendInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId } = req.params;

  const invite = await inviteService.sendWorkspaceInvite(req.body, userId, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Invite sent successfully',
    invite,
  });
};

export const allInvites = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { invites, total } = await inviteService.getAllInvites(workspaceId, page, limit);

  res.status(StatusCodes.OK).json({ total, page, limit, invites });
};

export const singleInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { inviteId } = req.params;

  const invite = await inviteService.getSingleInvite(inviteId);

  res.status(StatusCodes.OK).json({ invite });
};

export const deleteInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const { inviteId } = req.params;

  const invite = await inviteService.deleteWorkspaceInvite(inviteId);

  res.status(StatusCodes.OK).json({
    message: 'Invitation deleted successfully',
    invite,
  });
};

/**
 * ----------------- Workspace Members -----------------
 */

export const allMembers = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const { memberships, total } = await memberService.getAllWorkspaceMembers(
    page,
    limit,
    workspaceId
  );

  res.status(StatusCodes.OK).json({
    total,
    page,
    limit,
    members: memberships,
  });
};

export const getMember = async (req: Request, res: Response) => {
  const { workspaceId, memberId } = req.params;

  const membership = await memberService.getWorkspaceMember(workspaceId, memberId);

  res.status(StatusCodes.OK).json({ member: membership });
};

export const removeMember = async (req: Request, res: Response) => {
  assertAuth(req);
  const { userId } = req.user;
  const { workspaceId, memberId } = req.params;

  const member = await memberService.removeWorkspaceMember(userId, workspaceId, memberId);

  res.status(StatusCodes.OK).json({
    message: 'Member removed successfully',
    member,
  });
};

/**
 * ----------------- Roles Assignments -----------------
 */

export const assignRole = async (req: Request, res: Response) => {
  const { workspaceId, memberId, roleId } = req.params;

  const membership = await memberService.assignRoleToUser(workspaceId, memberId, roleId);

  res.status(StatusCodes.OK).json({
    message: 'Role assigned successfully',
    membership,
  });
};

export const unassignRole = async (req: Request, res: Response) => {
  const { workspaceId, memberId, roleId } = req.params;

  const membership = await memberService.unassignRoleFromUser(workspaceId, memberId, roleId);

  res.status(StatusCodes.OK).json({
    message: 'Role unassigned successfully',
    membership,
  });
};

/**
 * ----------------- Workspace Roles -----------------
 */

export const allRoles = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const workspaceRoles = await roleService.getWorkspaceRoles(workspaceId);
  const totalRoles = workspaceRoles.length;

  res.status(StatusCodes.OK).json({ totalRoles, workspaceRoles });
};

export const addRole = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;

  const workspaceRoles = await roleService.addWorkspaceRole(req.body, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role added successfully',
    workspaceRoles,
  });
};

export const updateRole = async (req: Request, res: Response) => {
  const { workspaceId, roleId } = req.params;

  const workspaceRoles = await roleService.updateWorkspaceRole(req.body, roleId, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role updated successfully',
    workspaceRoles,
  });
};

export const removeRole = async (req: Request, res: Response) => {
  const { workspaceId, roleId } = req.params;

  const workspaceRoles = await roleService.removeWorkspaceRole(roleId, workspaceId);

  res.status(StatusCodes.OK).json({
    message: 'Role removed successfully',
    workspaceRoles,
  });
};

/**
 * ----------------- Default export (workspace controllers) -----------------
 */

export default {
  // Workspace CRUD
  createWorkspace, // Create new workspace
  myWorkspaces, // List all workspaces for current user
  singleWorkspace, // Get single workspace details
  updateWorkspace, // Update workspace details
  deleteWorkspace, // Delete workspace
  myWorkspaceProfile, // Get current user's profile within a workspace

  // Workspace Invites
  sendInvite, // Send workspace invite
  allInvites, // List all invites in a workspace
  singleInvite, // Get details of a single invite
  deleteInvite, // Delete an invite

  // Workspace Members
  allMembers, // List all members of a workspace
  getMember, // Get details of a single member
  removeMember, // Remove a member from a workspace

  // Roles Assignments
  assignRole, // Assign role to a member
  unassignRole, // Remove role from a member

  // Workspace Roles
  allRoles, // List all workspace roles
  addRole, // Add new role
  updateRole, // Update role details
  removeRole, // Delete a role
};
