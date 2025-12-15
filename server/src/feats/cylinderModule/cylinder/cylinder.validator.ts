import { z } from 'zod';

export const getCylindersQuerySchema = z.object({
  mode: z.enum(['all', 'active', 'all-detailed', 'active-detailed']).default('active'),
  // Defaulting to standard 12kg, 22mm cylinders
  size: z.coerce.number().default(12),
  regulatorType: z.coerce.number().default(22),
});

export const bulkPriceUpdateSchema = z.object({
  updates: z
    .array(
      z.object({
        cylinderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Cylinder ID'),
        price: z.number().min(0),
      })
    )
    .min(1, 'At least one update is required'),
});

export const selectLocalBrandsSchema = z.object({
  selections: z
    .array(
      z.object({
        cylinderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Cylinder ID'),
        isActive: z.boolean(),
      })
    )
    .min(1, 'At least one selection is required'),
});
