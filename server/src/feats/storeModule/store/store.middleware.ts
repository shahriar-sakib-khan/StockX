import { Request, Response, NextFunction } from 'express';

import { Membership } from '../index.js';

import { Store } from './index.js';

import { assertAuth } from '@/common/index.js';
import { Errors } from '@/error/index.js';

/**
 * @function storeScope
 * @description Ensures the actor has access to the store.
 * Supports both Global Users (via Membership) and Local Staff (via Token).
 * * @param allowedRoles - List of roles permitted (e.g. ['owner', 'admin'])
 */
export const storeScope = (allowedRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Ensure Authenticated
    assertAuth(req);
    const { userId, role: userRole, type, storeId: tokenStoreId } = req.user;
    const { storeId: paramStoreId } = req.params;

    // 2. Resolve Store Context
    // Staff tokens have storeId embedded. Global users rely on URL params.
    const targetStoreId = paramStoreId || tokenStoreId;

    if (!targetStoreId) {
      throw new Errors.BadRequestError('Store context (ID) is missing');
    }

    // 3. Super Admin Override (Global 'ostad')
    if (userRole === 'ostad') {
      req.membership = {
        userId,
        storeId: targetStoreId,
        storeRole: 'ostad',
      };
      return next();
    }

    // ---------------------------------------------------------
    // SCENARIO A: Local Staff (Token-based Access)
    // ---------------------------------------------------------
    if (type === 'staff') {
      // Security: Staff can only access the store encoded in their token
      if (paramStoreId && paramStoreId !== tokenStoreId) {
        throw new Errors.ForbiddenError('Token is not valid for this store');
      }

      // Role Check
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        throw new Errors.ForbiddenError('Access denied: Insufficient staff privileges');
      }

      // Attach Context (Normalize to match Membership structure)
      req.membership = {
        userId,
        storeId: tokenStoreId!,
        storeRole: userRole,
      };
      return next();
    }

    // ---------------------------------------------------------
    // SCENARIO B: Global User (DB Membership Access)
    // ---------------------------------------------------------

    // 4. Verify Store Exists (Optional, but good for 404s)
    const storeExists = await Store.exists({ _id: targetStoreId });
    if (!storeExists) {
      throw new Errors.NotFoundError('Store not found');
    }

    // 5. Fetch Membership
    const membership = await Membership.findOne({
      store: targetStoreId,
      user: userId,
    }).select('storeRole status');
    console.log(membership);

    if (!membership || membership.status !== 'active') {
      throw new Errors.ForbiddenError('Access denied: You are not an active member of this store');
    }

    // 6. Role Check (Single String Comparison)
    if (allowedRoles.length > 0 && !allowedRoles.includes(membership.storeRole)) {
      throw new Errors.ForbiddenError('Access denied: Insufficient store privileges');
    }

    // 7. Attach Context
    req.membership = {
      userId,
      storeId: targetStoreId,
      storeRole: membership.storeRole,
    };

    next();
  };
};
