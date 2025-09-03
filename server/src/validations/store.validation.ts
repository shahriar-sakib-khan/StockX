/**
 * @module store.validation
 *
 * @description Zod schemas for store validation, including creation and update validation.
 */
import { z } from 'zod';

/**
 * storeInputSchema
 * @property {string} name - Required. Store name, at least 1 character.
 * @property {string} [contactName] - Optional. Contact person name.
 * @property {string} [phone] - Optional. Contact phone number.
 * @property {string} [address] - Optional. Store address.
 *
 * @description
 * Zod schema for creating a store.
 * Validates user input on the server side to enforce business rules.
 */
export const storeInputSchema = z
  .object({
    name: z.string().min(1, { message: 'Store name is required' }),
    contactName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .strict();

export type StoreInput = z.infer<typeof storeInputSchema>;

/**
 * UpdateStoreInput
 * @property {string} [name] - Optional. Store name, at least 1 character if provided.
 * @property {string} [contactName] - Optional. Contact person name.
 * @property {string} [phone] - Optional. Contact phone number.
 * @property {string} [address] - Optional. Store address.
 *
 * @description
 * Zod schema for updating store information.
 * Workspace and Division IDs must always be provided to ensure scope.
 * Other fields are optional to allow partial updates.
 */
export const updateStoreSchema = z
  .object({
    name: z.string().min(1, { message: 'Store name must be at least 1 character' }).optional(),
    contactName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .strict();

export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
