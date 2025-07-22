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

import { workspaceService } from '@/services/v1/index.js';
import { assertAuth } from '@/common/assertions';

// <============================> WORKSPACE CONTROLLER <============================>

export const createWorkspace = async (req: Request, res: Response) => {
  assertAuth(req);
  const workspace = await workspaceService.createWorkspace(req.body, req.user.userId);

  res.status(StatusCodes.CREATED).json({ workspace, message: 'Workspace created successfully' });
};

export const myWorkspaces = async (req: Request, res: Response) => {
  assertAuth(req);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
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

// <============================> WORKSPACE MEMBERS CONTROLLER <============================>

export const members = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const members = await workspaceService.getWorkspaceMembers(req.params.workspaceId, page, limit);
  const totalMembers = members.length;

  res.status(StatusCodes.OK).json({ totalMembers, page, limit, members });
};

// <============================> WORKSPACE ROLES CONTROLLER <============================>

export const roles = async (req: Request, res: Response) => {
  const roles = await workspaceService.getWorkspaceRoles(req.params.workspaceId);
  const totalRoles = roles.length;

  res.status(StatusCodes.OK).json({ totalRoles, roles });
};
