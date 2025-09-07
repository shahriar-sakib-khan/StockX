/**
 * @module store.validation
 * 
 * @description Validation schemas for store operations.
 */
import { z } from 'zod';

/**
 * StoreInputSchema
 * @description
 * Zod schema for creating or updating a store.
 * 
 * @property {string} name - Required. Store name.
 * @property {string} [contactName] - Optional. Contact name.
 * @property {string} [phone] - Optional. Phone number.
 * @property {string} [image] - Optional. Image URL.
 * @property {string} [address] - Optional. Store address.
 */
export const storeInputSchema = z
  .object({
    name: z.string().min(1, { message: 'Store name is required' }),
    contactName: z.string().optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
    address: z.string().optional(),
  })
  .strict();

export type StoreInput = z.infer<typeof storeInputSchema>;

/**
 * UpdateStoreInput
 * @description All fields are optional to support partial updates.
 */
export const updateStoreSchema = storeInputSchema.partial();

export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
