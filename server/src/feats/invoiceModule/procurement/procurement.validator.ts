import { z } from 'zod';

import { ProductType } from '@/feats/invoiceModule/invoice/invoice.constants.js';

const purchaseItem = z.object({
  productType: z.enum(ProductType),
  productId: z.string().min(1),
  quantity: z.number().positive(),
  unitCost: z.number().min(0),
});

const common = {
  supplierName: z.string().min(1),
  totalCost: z.number().min(0),
  paidAmount: z.number().min(0),
  paymentMethod: z.enum(['cash', 'bank', 'mobile', 'due']).optional(),
  ref: z.string().optional(),
};

export const purchasePackageSchema = z
  .object({
    ...common,
    items: z.array(purchaseItem.refine(i => i.productType === 'cylinder')).min(1),
  })
  .strict();

export const purchaseRefillSchema = z
  .object({
    ...common,
    items: z.array(purchaseItem.refine(i => i.productType === 'gas')).min(1),
  })
  .strict();

export const purchaseProductSchema = z
  .object({
    ...common,
    items: z.array(purchaseItem.refine(i => ['stove', 'regulator'].includes(i.productType))).min(1),
  })
  .strict();

export const purchaseDefectedSchema = z
  .object({
    ...common,
    // Exchange: Defected Out -> Full In
    items: z.array(purchaseItem.refine(i => i.productType === 'cylinder')).min(1),
  })
  .strict();

export type ProcurementInput = z.infer<typeof purchasePackageSchema>;
