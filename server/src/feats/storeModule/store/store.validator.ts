import { z } from 'zod';

/**
 * ----------------- Schemas -----------------
 */

export const createStoreSchema = z
  .object({
    name: z.string().min(1, { message: 'Store name is required' }).trim(),
    description: z.string().trim().optional(),
    location: z.string().min(1, { message: 'Location is required' }).trim(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, {
      message: 'Phone number must be 7-15 digits and may include a leading +',
    }),
    image: z.string().trim().optional(),
  })
  .strict();

export const updateStoreSchema = createStoreSchema.partial();

/**
 * ----------------- Types -----------------
 */
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
