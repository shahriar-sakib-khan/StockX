/**
 * @module workspace.service
 *
 * @description Services for workspace related operations:
 */

import { HydratedDocument, Types } from 'mongoose';

import { IWorkspace, Membership, Workspace } from '@/models';
import { WorkspaceInput } from '@/validations/workspace.validation';
import { Errors } from '@/error';

/**
 * @function createWorkspace
 * @description Creates a new workspace for the given user.
 * Throws error if workspace with the same name exists for this user.
 *
 * @param {WorkspaceInput} userData - Workspace creation data.
 * @param {string} userId - The creator's user ID.
 * @returns {Promise<HydratedDocument<IWorkspace>>} The newly created workspace document.
 * @throws {Errors.BadRequestError} If workspace name already exists.
 */
export const createWorkspace = async (
  userData: WorkspaceInput,
  userId: string
): Promise<HydratedDocument<IWorkspace>> => {
  const { name, description } = userData;

  const existingWorkspace = await Workspace.findOne({ name, createdBy: userId });
  if (existingWorkspace) throw new Errors.BadRequestError('Workspace name already exists');

  const workspace = await Workspace.create({
    name,
    description,
    createdBy: new Types.ObjectId(userId),
  });

  // Creator becomes Admin via Membership
  const membership = await Membership.create({
    user: new Types.ObjectId(userId),
    workspace: workspace._id,
    workspaceRoles: ['admin'],
    status: 'active',
  });

  return workspace;
};

/**
 * @function getAllWorkspaces
 * @description Retrieves all active workspaces for a given user by querying memberships.
 *
 * @param {string} userId - User's ID.
 * @returns {Promise<HydratedDocument<IWorkspace>[]>} List of active workspaces.
 */
export const getAllWorkspaces = async (
  userId: string,
  page: number,
  limit: number
): Promise<HydratedDocument<IWorkspace>[]> => {
  const skip: number = (page - 1) * limit;
  const memberships = await Membership.find({ user: userId, status: 'active' })
    .skip(skip)
    .limit(limit)
    .populate('workspace');

  const workspaces = memberships.map(m => m.workspace as unknown as HydratedDocument<IWorkspace>);

  return workspaces;
};

/**
 * @function getWorkspaceById
 * Finds a workspace by its unique _id.
 *
 * @param {string} workspaceId - Workspace name.
 * @returns {Promise<HydratedDocument<IWorkspace>>} Workspace document.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const getSingleWorkspace = async (
  workspaceId: string
): Promise<HydratedDocument<IWorkspace>> => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace;
};

/**
 * @function updateWorkspace
 * Updates the user's workspace.
 *
 * @param {WorkspaceInput} workspaceData - Workspace update data.
 * @param {string} workspaceId - Workspace ID.
 * @returns {Promise<HydratedDocument<IWorkspace>>} Updated workspace document.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const updateWorkspace = async (
  workspaceData: WorkspaceInput,
  workspaceId: string
): Promise<HydratedDocument<IWorkspace>> => {
  const workspace = await Workspace.findByIdAndUpdate(workspaceId, workspaceData, { new: true });

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace;
};

/**
 * @function deleteWorkspace
 * Deletes the user's workspace.
 *
 * @param {string} workspaceId - Workspace ID.
 * @returns {Promise<HydratedDocument<IWorkspace>>} Deleted workspace document.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const deleteWorkspace = async (
  workspaceId: string
): Promise<HydratedDocument<IWorkspace>> => {
  const workspace = await Workspace.findByIdAndDelete(workspaceId);

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace;
};

export default {
  createWorkspace,
  getAllWorkspaces,
  getSingleWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
