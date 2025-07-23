import { Request, Response, NextFunction } from 'express';
import { Membership, Workspace } from '@/models';
import { assertAuth } from '@/common/assertions.js';
import { StatusCodes } from 'http-status-codes';

const workspaceScope =
  (allowedRoles: string[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    assertAuth(req);
    const { userId, role } = req.user;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId).lean();
    if (!workspace) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Workspace not found' });

    // SuperAdmin override (ostad)
    if (role === 'ostad') return next();

    const membership = await Membership.findOne({
      user: userId,
      workspace: workspaceId,
    }).lean();

    if (!membership || membership.status !== 'active') {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Access denied: Not a workspace member' });
    }

    req.membership = membership;
    console.log(req.membership);
    
    if (allowedRoles.length > 0) {
      const hasWorkspaceRoles = membership.workspaceRoles.some(
        workspaceRoles =>
          allowedRoles.includes(workspaceRoles) || membership.workspaceRoles.includes('admin')
      );
      if (!hasWorkspaceRoles) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Access denied: Insufficient workspace role privileges' });
      }
    }

    next();
  };

export default workspaceScope;
