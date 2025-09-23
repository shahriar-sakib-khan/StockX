/**
 * @module globalBrand.validation
 *
 * @description
 * Validation schemas for global brand management operations.
 * Includes creating a global brand and updating global brand details.
 */

import { z } from 'zod';

/**
 * ----------------- Price Object Schema -----------------
 * @property {number} size - Required. Cylinder size for pricing.
 * @property {string} regulatorType - Required. Type of regulator associated with the price.
 * @property {number} price - Required. Price for this size and regulator type.
 */
const priceSchema = z
  .object({
    size: z.number({ message: 'Size is required' }),
    regulatorType: z.string().min(1, { message: 'Regulator type is required' }),
    price: z.number({ message: 'Price is required' }),
  })
  .strict();

/**
 * ----------------- Create Global Brand Schema -----------------
 * @property {string} name - Required. Name of the global brand.
 * @property {string} [brandImage] - Optional. Image representing the brand.
 * @property {string} [cylinderImage] - Optional. Image representing the cylinder.
 * @property {string[]} regulatorTypes - Required. Array of regulator types.
 * @property {number[]} sizes - Required. Array of available cylinder sizes.
 * @property {object[]} prices - Required. Array of price objects.
 */
export const createGlobalBrandSchema = z
  .object({
    name: z.string().min(1, { message: 'Brand name is required' }),
    brandImage: z.string().optional(),
    cylinderImage: z.string().optional(),
    regulatorTypes: z
      .array(z.string().min(1, { message: 'Regulator type cannot be empty' }))
      .min(1, { message: 'At least one regulator type is required' }),
    sizes: z
      .array(z.number({ message: 'Size must be a number' }))
      .min(1, { message: 'At least one size is required' }),

    prices: z.array(priceSchema).min(1, { message: 'At least one price entry is required' }),
  })
  .strict();

export type CreateGlobalBrandInput = z.infer<typeof createGlobalBrandSchema>;

/**
 * ----------------- Update Global Brand Schema -----------------
 * @description
 * Allows partial updates of global brand fields.
 */
export const updateGlobalBrandSchema = createGlobalBrandSchema.partial();
export type UpdateGlobalBrandInput = z.infer<typeof updateGlobalBrandSchema>;
