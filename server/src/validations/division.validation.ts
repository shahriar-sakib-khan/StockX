import z from 'zod';

/**
 * DivisionInput
 * @property {string} name - Required. Must be between 3 and 50 characters.
 * @property {string} [description] - Optional. Must be less than 200 characters.
 *
 * @description
 * Zod schema for division validation.
 * Validates user input on the server side to enforce business rules.
 */
export const divisionSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Division name must be at least 3 characters' })
      .max(50, { message: 'Division name must be less than 50 characters' })
      .regex(
        /^[A-Za-z0-9\s_-]+$/,
        'Division name can only include letters, numbers, spaces, hyphens, and underscores'
      ),
    description: z
      .string()
      .max(200, { message: 'Description must be less than 200 characters' })
      .optional(),
  })
  .strict();

export type DivisionInput = z.infer<typeof divisionSchema>;

/**
 * DivisionRoleInput
 * @property {string} name - Required. Must be between 3 and 50 characters.
 * @property {string[]} permissions - Required. At least one permission is required.
 *
 * @description
 * Zod schema for division role validation.
 * Validates user input on the server side to enforce business rules.
 */
export const divisionRolesSchema = z.object({
  name: z.string().min(1, { message: 'Role name is required' }),
  permissions: z.array(z.string()).min(1, { message: 'At least one permission is required' }),
});

export type DivisionRoleInput = z.infer<typeof divisionRolesSchema>;
