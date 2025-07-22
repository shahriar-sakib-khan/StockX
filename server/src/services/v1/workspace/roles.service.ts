import { Errors } from "@/error";
import { Workspace } from "@/models";

/**
 * All active workspace roles.
 *
 * @param {string} workspaceId - Workspace's ID.
 * @returns {Promise<{ name: string; permissions: string[] }[]>} List of active user of this workspaces.
 */
export const getWorkspaceRoles = async (
  workspaceId: string
): Promise<Array<{ name: string; permissions: string[] }>> => {
  const workspace = await Workspace.findById(workspaceId).select('customRoles').lean();

  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  return workspace.customRoles || [];
};
