import { z } from 'zod';

// Due Payment
export const shopDueSchema = z
  .object({
    totalAmount: z.number().positive(),
    paymentMethod: z.enum(['cash', 'bank', 'mobile', 'other']),
    ref: z.string().optional(),
    details: z.record(z.string(), z.any()).optional(),
  })
  .strict();

// Cylinder Item in Exchange
const cylinderItemSchema = z.object({
  id: z.string(), // Cylinder ID
  quantity: z.number().int().positive(),
  size: z.number(), // Metadata helper
});

// Cylinder Exchange (Complex)
export const cylinderExchangeSchema = z
  .object({
    shopId: z.string(),
    // Logic: 'take' = Receive Empty from Shop, 'give' = Deliver Full to Shop
    cylinders: z.object({
      take: z.array(cylinderItemSchema).default([]),
      give: z.array(cylinderItemSchema).default([]),
    }),
    quantity: z.number().int().nonnegative(), // Net total moved

    totalPrice: z.number().nonnegative(), // Total Bill
    paidAmount: z.number().nonnegative(), // Paid Now
    due: z.number().nonnegative(), // Remaining Due

    paymentMethod: z.enum(['cash', 'bank', 'mobile', 'due', 'other']),
    vehicleId: z.string().optional(),
    ref: z.string().optional(),
    details: z.record(z.string(), z.any()).optional(),
  })
  .strict()
  .refine(data => data.paidAmount + data.due === data.totalPrice, {
    message: 'Paid amount + Due must equal Total Price',
    path: ['due'],
  });

export type ShopDueInput = z.infer<typeof shopDueSchema>;
export type CylinderExchangeInput = z.infer<typeof cylinderExchangeSchema>;
