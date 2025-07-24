import { HydratedDocument } from 'mongoose';

import { Errors } from '@/error';
import { IUser, Membership, Workspace } from '@/models';

/**
 * All active workspace members.
 *
 * @param {string} workspaceId - Workspace's ID.
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @returns {Promise<HydratedDocument<IUser>[]>} List of active user of this workspaces.
 */
export const getWorkspaceMembers = async (
  workspaceId: string,
  page: number,
  limit: number
): Promise<Array<HydratedDocument<IUser>>> => {
  const workspace = await Workspace.findById(workspaceId).select('_id').lean();
  if (!workspace) throw new Errors.NotFoundError('Workspace not found');

  const skip: number = (page - 1) * limit;
  const memberships = await Membership.find({ workspace: workspaceId, status: 'active' })
    .skip(skip)
    .limit(limit)
    .populate('user');

  if (!memberships) throw new Errors.NotFoundError('Workspace not found');

  const members = memberships.map(m => m.user as unknown as HydratedDocument<IUser>);

  return members;
};

export default { getWorkspaceMembers };
