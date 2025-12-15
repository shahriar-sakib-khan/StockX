import { z } from 'zod';

const cylinderLoad = z.object({
  cylinderId: z.string().min(1), // The 'Type' ID (Brand+Size)
  fullCount: z.number().nonnegative().default(0),
  emptyCount: z.number().nonnegative().default(0),
  defectedCount: z.number().nonnegative().default(0),
});

const itemLoad = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive(),
});

export const cargoOperationSchema = z
  .object({
    cylinders: z.array(cylinderLoad).default([]),
    stoves: z.array(itemLoad).default([]),
    regulators: z.array(itemLoad).default([]),

    // Metadata
    ref: z.string().optional(),
    note: z.string().optional(),
  })
  .strict();

export type CargoOperationInput = z.infer<typeof cargoOperationSchema>;
