import { Workspace, Membership } from '@/models';
import { Types } from 'mongoose';

interface ICreateWorkspaceData {
  name: string;
  description?: string;
}

export const createWorkspace = async (
  userId: Types.ObjectId,
  workspaceData: ICreateWorkspaceData
) => {
  const workspace = await Workspace.create({
    ...workspaceData,
    createdBy: userId,
  });

  await Membership.create({
    user: userId,
    workspace: workspace._id,
    role: 'admin',
    status: 'active',
  });

  return workspace;
};
