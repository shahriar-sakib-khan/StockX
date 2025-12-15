import { z } from 'zod';

export const getStovesQuerySchema = z.object({
  mode: z.enum(['all', 'detailed']).default('all'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  burnerCount: z.coerce.number().optional(),
});

export const addStockSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Stove ID'),
  quantity: z.number().int().positive(),
  cost: z.number().min(0).default(0),
});

export const updatePriceSchema = z.object({
  price: z.number().min(0),
});
