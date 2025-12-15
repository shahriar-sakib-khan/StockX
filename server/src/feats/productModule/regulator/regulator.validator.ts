import { z } from 'zod';

export const getRegulatorsQuerySchema = z.object({
  mode: z.enum(['all', 'detailed']).default('all'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  regulatorType: z.coerce.number().optional(),
});

export const updatePriceSchema = z.object({
  price: z.number().min(0),
});
