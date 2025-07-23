import { Errors } from '@/error';
import { Workspace, IWorkspace } from '@/models';

/**
 * All active workspace roles.
 *
 * @param {string} workspaceId - Workspace's ID.
 * @returns {Promise<IWorkspace['customWorkspaceRoles']>} List of custom roles.
 */
export const getWorkspaceRoles = async (
  workspaceId: string
): Promise<IWorkspace['customWorkspaceRoles']> => {
  const workspace = await Workspace.findById(workspaceId).select('customWorkspaceRoles').lean();

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace.customWorkspaceRoles;
};

export default { getWorkspaceRoles };
