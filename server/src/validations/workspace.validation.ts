/**
 * @module workspace.validation
 *
 * @description Validation schemas for workspace operations.
 */
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
      .min(3, { message: 'Workspace name must be at least 3 characters' })
      .max(50, { message: 'Workspace name must be less than 50 characters' })
      .regex(/^[A-Za-z0-9\s_-]+$/, {
        message:
          'Workspace name can only include letters, numbers, spaces, hyphens, and underscores',
      }),
    description: z
      .string()
      .max(200, { message: 'Description must be less than 200 characters' })
      .optional(),
  })
  .strict();
export type WorkspaceInput = z.infer<typeof workspaceSchema>;

/**
 * WorkspaceUpdateInput
 * @description
 * This schema extends WorkspaceInput with partial updates.
 * All fields are optional to allow partial updates.
 */
export const workspaceUpdateSchema = workspaceSchema.partial();

export type WorkspaceUpdateInput = z.infer<typeof workspaceUpdateSchema>;

/**
 * ----------------- Invite Validations -----------------
 */

/**
 * InviteInput
 * @property {string} email - Required. Must be a valid email format.
 *
 * @description
 * Zod schema for invite validation.
 * Validates user input on the server side to enforce business rules.
 */
export const inviteSchema = z
  .object({
    email: z.email({ message: 'Invalid email format' }),
    // role: z
    //   .enum(roleConstants.DefaultWorkspaceRoles, {
    //     message: 'Invalid role provided',
    //   })
    //   .optional(),
  })
  .strict();
export type InviteInput = z.infer<typeof inviteSchema>;

/**
 * ----------------- Role Validations -----------------
 */

/**
 * RolesInput
 * @property {string} name - Required. Must be between 3 and 50 characters.
 * @property {string[]} permissions - Required. At least one permission is required.
 *
 * @description
 * Zod schema for role validation.
 * Validates user input on the server side to enforce business rules.
 */
export const roleSchema = z
  .object({
    name: z.string().min(1, { message: 'Role name is required' }),
    permissions: z.array(z.string()).min(1, { message: 'At least one permission is required' }),
  })
  .strict();
export type RolesInput = z.infer<typeof roleSchema>;
