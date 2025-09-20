import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { assertAuth } from '@/common/assertions.js';

import { Membership } from '../index.js';
import { Store } from './index.js';

/**
 * @function storeScope
 * @description
 * Middleware for store-level access control.
 *
 * - Ensures user is authenticated
 * - Validates that the store exists
 * - Validates that the user is an active member of the store
 * - Optionally enforces role-based access
 * - Attaches store membership to the request object
 *
 * @param {string[]} allowedRoles - Optional array of roles required to access the route
 */
export const storeScope = (allowedRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ensure user is authenticated
    assertAuth(req);
    const { userId, role } = req.user;

    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Authentication required.',
      });
    }

    // Validate that the store exists
    const { storeId } = req.params;

    const store = await Store.findById(storeId).select('name').lean();
    if (!store) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Store not found.',
      });
    }

    // Super admin (ostad) overrides role checks
    if (role === 'ostad') {
      req.membership = {
        userId,
        storeId,
        storeRoles: store.storeRoles.map(role => role.name), // Give all store roles
      };
      return next();
    }

    // Validate that the user is an active member of the store
    const membership = await Membership.findOne({
      store: storeId,
      user: userId,
    })
      .select('storeRoles status')
      .lean();

    if (!membership || membership.status !== 'active') {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'Access denied: Not an active store member.',
      });
    }

    // Enforce role-based access if any roles are specified
    if (allowedRoles.length > 0) {
      const hasRequiredRole = membership.storeRoles.some(userRole =>
        allowedRoles.includes(userRole)
      );

      if (!hasRequiredRole) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: 'Access denied: Insufficient role privileges.',
        });
      }
    }

    // Attach store membership to the request
    req.membership = {
      userId,
      storeId,
      storeRoles: membership.storeRoles,
    };

    return next();
  };
};
