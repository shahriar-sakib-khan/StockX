import { z } from 'zod';

import { InviteLifespan, InviteRoles } from './invite.constants.js';

/**
 * ----------------- Schemas -----------------
 */
export const createInviteSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    role: z.enum(InviteRoles, { message: 'Invalid invite role. Must be owner or admin.' }),
    lifespan: z.enum(InviteLifespan, { message: 'Invalid invite lifespan' }),
  })
  .strict();

export const updateInviteSchema = createInviteSchema.partial();

/**
 * ----------------- Types -----------------
 */
export type CreateInviteInput = z.infer<typeof createInviteSchema>;
export type UpdateInviteInput = z.infer<typeof updateInviteSchema>;
