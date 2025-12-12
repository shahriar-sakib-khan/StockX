import { Request } from 'express';

import { Errors } from '@/error/index.js';

// ------------------------------------------------------------------
// Type Definitions (Discriminated Union)
// ------------------------------------------------------------------

export interface GlobalUserPayload {
  userId: string;
  role: string;
  type?: 'user'; // Optional literal for global users
  storeId?: never; // Explicitly missing on Global Users
}

export interface LocalStaffPayload {
  userId: string;
  role: string;
  type: 'staff'; // Discriminator
  storeId: string; // Required for staff
}

// The Union: req.user can be one of these two
export type AuthUser = GlobalUserPayload | LocalStaffPayload;

// ------------------------------------------------------------------
// Base Authentication
// ------------------------------------------------------------------

/**
 * Asserts that the request has a user attached.
 * Narrows req.user to the AuthUser union type.
 */
export function assertAuth(req: Request): asserts req is Request & { user: AuthUser } {
  if (!req.user) {
    throw new Errors.UnauthenticatedError('Authentication required');
  }
}

// ------------------------------------------------------------------
// Role/Type Specific Assertions
// ------------------------------------------------------------------

/**
 * Asserts that the user is a Global User (Owner/Partner/Admin).
 */
export function assertGlobalUser(
  req: Request
): asserts req is Request & { user: GlobalUserPayload } {
  assertAuth(req);

  if (req.user.type === 'staff') {
    throw new Errors.ForbiddenError('Access denied: This action is restricted to Global Users');
  }
}

/**
 * Asserts that the user is a Local Staff member.
 */
export function assertLocalStaff(
  req: Request
): asserts req is Request & { user: LocalStaffPayload } {
  assertAuth(req);

  if (req.user.type !== 'staff') {
    throw new Errors.ForbiddenError('Access denied: This action is restricted to Local Staff');
  }

  if (!req.user.storeId) {
    throw new Errors.UnauthenticatedError('Invalid staff session: Store context missing');
  }
}

// ------------------------------------------------------------------
// Context Specific Assertions
// ------------------------------------------------------------------

/**
 * Asserts that req.membership is populated AND req.user is present.
 * Use this in controllers before accessing req.membership or req.user.
 */
export function assertMembership(req: Request): asserts req is Request & {
  user: AuthUser; // <--- ADDED: Ensures req.user is carried over
  membership: { userId: string; storeId: string; storeRole: string };
} {
  // 1. Ensure User is Authenticated first (Runtime check)
  assertAuth(req);

  // 2. Ensure Membership exists
  if (!req.membership) {
    throw new Errors.UnauthenticatedError('Store membership context required');
  }
}
