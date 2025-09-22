/**
 * @module store.validation
 *
 * @description
 * Validation schemas for store management operations.
 * Includes creating a store and updating store details.
 */

import { z } from 'zod';

/**
 * ----------------- Create Store Schema -----------------
 * @property {string} name - Required. Store name.
 * @property {string} [description] - Optional. Description of the store.
 * @property {string} location - Required. Store location.
 * @property {string} phone - Required. Valid phone number.
 */
export const createStoreSchema = z
  .object({
    name: z.string().min(1, { message: 'Store name is required' }),
    description: z.string().optional(),
    location: z.string().min(1, { message: 'Location is required' }),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, {
      message: 'Phone number must be 7-15 digits and may include a leading +',
    }),
  })
  .strict();

export type CreateStoreInput = z.infer<typeof createStoreSchema>;

/**
 * ----------------- Update Store Schema -----------------
 * @description
 * Allows partial updates of store fields.
 * Additional fields: image
 * @property {string} [image] - Optional. Must be a valid URL.
 */
export const updateStoreSchema = createStoreSchema
  .extend({ image: z.string().trim().optional() })
  .partial();

export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
