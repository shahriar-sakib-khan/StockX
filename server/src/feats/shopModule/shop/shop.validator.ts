import { z } from 'zod';

export const createShopSchema = z
  .object({
    shopName: z.string().min(1, 'Shop name is required').trim(),
    ownerName: z.string().trim().optional(),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
      .optional(),
    location: z.string().min(1, 'Location is required').trim(),
    image: z.string().url().optional().or(z.literal('')),
  })
  .strict();

export const updateShopSchema = createShopSchema.partial();

export type CreateShopInput = z.infer<typeof createShopSchema>;
export type UpdateShopInput = z.infer<typeof updateShopSchema>;
