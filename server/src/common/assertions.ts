import { Request } from 'express';

import { Errors } from '@/error/index.js';

/**
 * Asserts that req.user is defined and contains userId and role properties.
 */
export function assertAuth(
  req: Request
): asserts req is Request & { user: { userId: string; role: string } } {
  if (!req.user) {
    throw new Errors.UnauthenticatedError('Authentication required');
  }
}

/**
 * Asserts that req.membership is defined and contains user, workspace, and workspaceRoles properties.
 */
export function assertMembership(req: Request): asserts req is Request & {
  membership: { user: string; workspace: string; workspaceRoles: string[] };
} {
  if (!req.membership) {
    throw new Errors.UnauthenticatedError('Membership required');
  }
}

/**
 * Asserts that req.cycle is defined and contains cycleId, month, year, and isClosed properties.
 */
export function assertCycle(req: Request): asserts req is Request & {
  cycle: { cycleId: string; month: number; year: number; isClosed: boolean };
} {
  if (!req.cycle) {
    throw new Errors.NotFoundError('Active cycle not found in request');
  }
}
