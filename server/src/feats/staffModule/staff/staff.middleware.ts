import { Request, Response, NextFunction } from 'express';

import { StaffRoleLevels, StaffRoleType } from './staff.constants.js';

import { assertAuth } from '@/common/index.js';
import { Errors } from '@/error/index.js';
import { Membership } from '@/feats/storeModule/index.js';

/**
 * ----------------- Helpers -----------------
 */

export const assertHierarchy = (
  actorRole: string,
  targetRole: string,
  isGlobalOwner: boolean
): void => {
  if (isGlobalOwner) return;

  const actorLevel = StaffRoleLevels[actorRole as StaffRoleType];
  const targetLevel = StaffRoleLevels[targetRole as StaffRoleType];

  if (actorLevel === undefined) throw new Errors.ForbiddenError('Invalid actor role');
  if (targetLevel === undefined) throw new Errors.BadRequestError('Invalid target role');

  if (targetLevel <= actorLevel) {
    throw new Errors.ForbiddenError(`You cannot manage a user with role '${targetRole}'`);
  }
};

/**
 * ----------------- Middleware -----------------
 */

export const staffScope = (allowedRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Assert Auth (Narrows req.user to AuthUser union)
    assertAuth(req);

    // 2. Destructure common fields
    const { userId, role: userRole, type } = req.user;
    const { storeId: paramStoreId } = req.params;

    // Resolve Store Context
    // We cannot access req.user.storeId directly yet because it's only on LocalStaffPayload
    let tokenStoreId: string | undefined;

    if (type === 'staff') {
      // TS knows this is LocalStaffPayload
      tokenStoreId = req.user.storeId;
    }

    const storeId = paramStoreId || tokenStoreId;

    if (!storeId) throw new Errors.BadRequestError('Store context missing');

    if (tokenStoreId && tokenStoreId !== storeId) {
      throw new Errors.ForbiddenError('Token valid for different store');
    }

    let actorRole = '';

    // 3. Resolve Actor Role
    if (type === 'staff') {
      // --- Local Staff ---
      actorRole = userRole;
    } else {
      // --- Global User ---
      const membership = await Membership.findOne({
        store: storeId,
        user: userId,
        status: 'active',
      }).select('storeRole');

      if (!membership) {
        throw new Errors.UnauthenticatedError('Not a member of this store');
      }
      actorRole = membership.storeRole;
    }

    // 4. Permission Check
    if (allowedRoles.length > 0) {
      if (!allowedRoles.includes(actorRole)) {
        throw new Errors.ForbiddenError('Insufficient privileges');
      }
    }

    // 5. Update Context
    // We update the role in req.user to match the resolved store role
    req.user.role = actorRole;

    next();
  };
};
