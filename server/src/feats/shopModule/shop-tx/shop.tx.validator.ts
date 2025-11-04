import { z } from 'zod';

export const shopDueInputSchema = z.object({
  totalAmount: z.number().positive(),
  paymentMethod: z.string(),
  ref: z.string().optional(),
  details: z.string().optional(),
});

export type ShopDueInput = z.infer<typeof shopDueInputSchema>;
