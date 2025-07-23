/**
 * @module WorkspaceController
 *
 * @description Controller for workspace related operations.
 * General controllers: 
 * - Create a new workspace
 * - Get a single workspace by ID
 * - Get all workspaces
 * - Delete a workspace
 * - Update a workspace
 * 
 * Members controller:
 * - Get a list of workspace members
//  * - Add a member to a workspace
//  * - Remove a member from a workspace
 * 
 * Roles controller:
 * - Get a list of workspace roles
//  * - Add a role to a workspace
//  * - Remove a role from a workspace
//  * - Update a role in a workspace
 * 
 * Invites controller:
//  * - Get a list of workspace invites
//  * - Accept/Decline an invite
//  * - Send an invite
 * 
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  workspaceService,
  membersService,
  rolesService,
  invitesService,
} from '@/services/v1/index';
import { assertAuth } from '@/common/assertions';
import { inviteSchema } from '@/validations/workspace.validation';

// <============================> WORKSPACE CONTROLLER <============================>

export const createWorkspace = async (req: Request, res: Response) => {
  assertAuth(req);
  const workspace = await workspaceService.createWorkspace(req.body, req.user.userId);

  res.status(StatusCodes.CREATED).json({ workspace, message: 'Workspace created successfully' });
};

export const myWorkspaces = async (req: Request, res: Response) => {
  assertAuth(req);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const workspaces = await workspaceService.getAllWorkspaces(req.user.userId, page, limit);

  const totalWorkspaces = workspaces.length;

  res.status(StatusCodes.OK).json({ totalWorkspaces, page, limit, workspaces });
};

export const singleWorkspace = async (req: Request, res: Response) => {
  const workspace = await workspaceService.getSingleWorkspace(req.params.workspaceId);

  res.status(StatusCodes.OK).json({ workspace });
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const workspace = await workspaceService.updateWorkspace(req.body, req.params.workspaceId);

  res.status(StatusCodes.OK).json({ message: 'Workspace updated successfully', workspace });
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const workspace = await workspaceService.deleteWorkspace(req.params.workspaceId);

  res.status(StatusCodes.OK).json({ message: 'Workspace deleted successfully', workspace });
};

// <============================> INVITES CONTROLLER <============================>

export const sendInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const invite = await invitesService.sendWorkspaceInvite(
    req.body,
    req.user.userId,
    req.membership.workspace
  );

  res.status(StatusCodes.OK).json({ message: 'Invite sent successfully', invite });
};

export const acceptInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const invite = await invitesService.acceptWorkspaceInvite(req.params.token, req.user.userId);

  res.status(StatusCodes.OK).json({ message: 'Invite accepted successfully', invite });
};

export const declineInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const invite = await invitesService.declineWorkspaceInvite(req.params.token, req.user.userId);

  res.status(StatusCodes.OK).json({ message: 'Invite declined successfully', invite });
};

export const allInvites = async (req: Request, res: Response) => {
  assertAuth(req);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const allInvites = await invitesService.getAllInvites(req.membership.workspace, page, limit);

  const totalInvites = allInvites.length;

  res.status(StatusCodes.OK).json({ totalInvites, page, limit, allInvites });
};

export const deleteInvite = async (req: Request, res: Response) => {
  assertAuth(req);
  const invite = await invitesService.deleteWorkspaceInvite(req.params.token);

  res.status(StatusCodes.OK).json({ message: 'Invitation deleted successfully', invite });
}

// <============================> WORKSPACE MEMBERS CONTROLLER <============================>

export const allMembers = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const members = await membersService.getWorkspaceMembers(req.params.workspaceId, page, limit);

  const totalMembers = members.length;

  res.status(StatusCodes.OK).json({ totalMembers, page, limit, members });
};

// <============================> WORKSPACE ROLES CONTROLLER <============================>

export const roles = async (req: Request, res: Response) => {
  const roles = await rolesService.getWorkspaceRoles(req.params.workspaceId);
  const totalRoles = roles.length;

  res.status(StatusCodes.OK).json({ totalRoles, roles });
};

// <============================> Exports <============================>

export default {
  createWorkspace,
  myWorkspaces,
  singleWorkspace,
  updateWorkspace,
  deleteWorkspace,

  sendInvite,
  acceptInvite,
  declineInvite,
  allInvites,
  deleteInvite,

  allMembers,
  roles,
};
