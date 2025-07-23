import { WORKSPACE_ROLES } from '@/config/roles.config';
import { z } from 'zod';

/**
 * WorkspaceInput
 * @property {string} name - Required. Must be between 3 and 50 characters.
 * @property {string} [description] - Optional. Must be less than 200 characters.
 *
 * @description
 * Zod schema for workspace validation.
 * Validates user input on the server side to enforce business rules.
 */
export const workspaceSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Workspace name must be at least 3 characters')
      .max(50, 'Workspace name must be less than 50 characters')
      .regex(
        /^[A-Za-z0-9\s_-]+$/,
        'Workspace name can only include letters, numbers, spaces, hyphens, and underscores'
      ),

    description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  })
  .strict();

export type WorkspaceInput = z.infer<typeof workspaceSchema>;

/**
 * InviteInput
 * @property {string} email - Required. Must be a valid email format.
 * @property {string} role - Required. Must be one of the predefined workspace roles.
 *
 * @description
 * Zod schema for invite validation.
 * Validates user input on the server side to enforce business rules.
 */
export const inviteSchema = z
  .object({
    email: z.email('Invalid email format'),
    role: z.enum(WORKSPACE_ROLES, {
      message: 'Role must be one of the predefined workspace roles',
    }),
  })
  .strict();

export type InviteInput = z.infer<typeof inviteSchema>;
