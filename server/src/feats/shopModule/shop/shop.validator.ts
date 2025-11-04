/**
 * @module shop.validation
 *
 * @description
 * Zod validation schemas for shop operations.
 * Handles creating and updating client shop details.
 */

import { z } from 'zod';

/**
 * ----------------- Create Shop Schema -----------------
 * @property {string} shopName - Required. Name of the client shop.
 * @property {string} [ownerName] - Optional. Name of the shop owner.
 * @property {string} [phoneNumber] - Optional. Contact number of the shop.
 * @property {string} location - Required. Physical location of the shop.
 * @property {string} [image] - Optional. Image URL of the shop.
 */
export const createShopSchema = z
  .object({
    shopName: z.string().trim().min(1, { message: 'Shop name is required' }),
    ownerName: z.string().trim().optional(),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]*$/, { message: 'Invalid phone number format' })
      .optional(),
    location: z.string().trim().min(1, { message: 'Location is required' }),
    image: z.string().trim().optional(),
  })
  .strict();

export type CreateShopInput = z.infer<typeof createShopSchema>;

/**
 * ----------------- Update Shop Schema -----------------
 * @description
 * Allows partial updates of shop details.
 */
export const updateShopSchema = createShopSchema.partial();
export type UpdateShopInput = z.infer<typeof updateShopSchema>;
