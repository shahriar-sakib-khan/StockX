/**
 * @module localBrand.validation
 *
 * @description
 * Validation schemas for local brand operations.
 */

import { z } from 'zod';

/**
 * ----------------- Local Brand Selection Schema -----------------
 * @property {string} id - Required. Unique identifier of the brand.
 * @property {boolean} isActive - Required. Indicates if the brand is active.
 */
export const localBrandSelectionSchema = z.array(
  z
    .object({
      id: z.string().min(1, { message: 'Brand ID is required' }),
      isActive: z.boolean({ message: 'isActive flag is required' }),
    })
    .strict()
);

export type LocalBrandSelectionInput = z.infer<typeof localBrandSelectionSchema>;
