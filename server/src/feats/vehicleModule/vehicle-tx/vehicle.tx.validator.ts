import { z } from 'zod';

// We accept any string for payment method now, validated by Service logic or Enum
export const vehicleTxSchema = z
  .object({
    amount: z.number().min(0, 'Amount must be positive'),
    paymentMethod: z.enum(['cash', 'bank', 'mobile', 'due', 'other']).optional(),
    ref: z.string().trim().optional(),
    details: z.record(z.string(), z.any()).optional(),
  })
  .strict();

export type VehicleTxInput = z.infer<typeof vehicleTxSchema>;
