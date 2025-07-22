import { z } from 'zod';

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
