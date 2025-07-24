import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions';
import { Division, DivisionMembership } from '@/models';

const divisionScope = (allowedRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    assertAuth(req);
    const { role } = req.user;
    const { workspaceId, divisionId } = req.params;
    const { user, workspaceRoles } = req.membership;

    // Division check
    const division = await Division.findById(divisionId).select('workspace').lean();
    if (!division) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Division not found' });
    if (division.workspace.toString() !== workspaceId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Division does not belong to this workspace' });
    }

    // SuperAdmin override (ostad)
    if (role === 'ostad') return next();

    // Workspace admin override
    if (workspaceRoles.includes('admin')) return next();

    // Division membership check
    const divisionMembership = await DivisionMembership.findOne({
      user,
      division: divisionId,
    }).lean();
    if (!divisionMembership || divisionMembership.status !== 'active') {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Access denied: Not a division member' });
    }

    // Assign division-membership to request object
    req.divMembership = divisionMembership;

    // Role validation
    if (allowedRoles.length > 0) {
      const hasDivisionRoles = divisionMembership.divisionRoles.some(
        divisionRole =>
          allowedRoles.includes(divisionRole) || divisionMembership.divisionRoles.includes('admin')
      );
      if (!hasDivisionRoles) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Access denied: Insufficient division role privileges' });
      }
    }

    next();
  };
};

export default divisionScope;
