import { Errors } from '@/error';
import { Workspace, IWorkspace, Membership } from '@/models';
import { RolesInput } from '@/validations/workspace.validation';
import { workspaceMembershipSanitizers } from '@/utils';

/**
 * All roles of the workspace.
 *
 * @param {string} workspaceId - Workspace's ID.
 * @returns {Promise<IWorkspace['workspaceRoles']>} List of workspace roles.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const getWorkspaceRoles = async (
  workspaceId: string
): Promise<IWorkspace['workspaceRoles']> => {
  const workspace = await Workspace.findById(workspaceId).select('workspaceRoles').lean();

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace.workspaceRoles;
};

/**
 * Adds a new role to the workspace roles.
 *
 * @param {RolesInput} userData - Workspace update data.
 * @param {string} workspaceId - Workspace ID.
 * @returns {Promise<IWorkspace['workspaceRoles']>} List of workspace roles.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const addWorkspaceRole = async (
  userData: RolesInput,
  workspaceId: string
): Promise<IWorkspace['workspaceRoles']> => {
  const { name, permissions } = userData;
  const workspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    { $push: { workspaceRoles: { name, permissions } } },
    { new: true }
  );

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace.workspaceRoles;
};

/**
 * Updates a role of the workspace roles.
 *
 * @param {RolesInput} userData - Workspace update data.
 * @param {string} roleId - Role ID.
 * @param {string} workspaceId - Workspace ID.
 * @returns {Promise<IWorkspace['workspaceRoles']>} List of workspace roles.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const updateWorkspaceRole = async (
  userData: RolesInput,
  roleId: string,
  workspaceId: string
): Promise<IWorkspace['workspaceRoles']> => {
  const { name, permissions } = userData;
  const workspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId, 'workspaceRoles._id': roleId },
    { $set: { 'workspaceRoles.$.name': name, 'workspaceRoles.$.permissions': permissions } },
    { new: true }
  );

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace.workspaceRoles;
};

/**
 * Removes a role of the workspace roles.
 *
 * @param {string} roleId - Role ID.
 * @param {string} workspaceId - Workspace ID.
 * @returns {Promise<IWorkspace['workspaceRoles']>} List of workspace roles.
 * @throws {Errors.NotFoundError} If workspace not found.
 */
export const removeWorkspaceRole = async (
  roleId: string,
  workspaceId: string
): Promise<IWorkspace['workspaceRoles']> => {
  const workspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId },
    { $pull: { workspaceRoles: { _id: roleId } } },
    { new: true }
  );

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace.workspaceRoles;
};

export default {
  getWorkspaceRoles,
  addWorkspaceRole,
  removeWorkspaceRole,
  updateWorkspaceRole,
};
