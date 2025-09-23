/**
 * @module invite.validation
 *
 * @description
 * Validation schemas for invite management operations.
 * Includes creating an invite and updating invite details.
 */

import { z } from 'zod';

import { InviteLifespan, InviteRoles } from './invite.constants.js';

/**
 * ----------------- Create Invite Schema -----------------
 * @property {string} email - Required. Email of the invited user.
 * @property {string} role - Required. Role assigned to the invited user.
 * @property {string} lifespan - Required. Invite lifespan.
 */
export const createInviteSchema = z
  .object({
    email: z
      .string()
      .refine(val => /^\S+@\S+\.\S+$/.test(val), { message: 'Invalid email address' }),
    role: z.enum(...[InviteRoles], { message: 'Invalid invite role' }),
    lifespan: z.enum(...[InviteLifespan], { message: 'Invalid invite lifespan' }),
  })
  .strict();

export type CreateInviteInput = z.infer<typeof createInviteSchema>;

/**
 * ----------------- Update Invite Schema -----------------
 * @description
 * Allows partial updates of invite fields.
 */
export const updateInviteSchema = createInviteSchema.partial();
export type UpdateInviteInput = z.infer<typeof updateInviteSchema>;
