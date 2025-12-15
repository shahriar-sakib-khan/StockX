import { z } from 'zod';

import { ProductType } from './invoice.constants.js';

// --- Shared Components ---
const soldItem = z.object({
  productType: z.enum(ProductType),
  productId: z.string().min(1),
  name: z.string().min(1),
  size: z.number().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
});

const returnedItem = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().positive(),
});

const financials = z.object({
  discount: z.number().min(0).default(0),
  paidAmount: z.number().min(0).default(0),
  paymentMethod: z.enum(['cash', 'bank', 'mobile', 'due', 'other']).optional(),
  ref: z.string().optional(),
});

// ==========================================
// 1. STORE DIRECT (B2C) SCHEMAS
// ==========================================

export const b2cExchangeSchema = z
  .object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1).optional(),
    // MUST be 'gas' (Refill)
    items: z
      .array(
        soldItem.refine(i => i.productType === 'gas', {
          message: 'Exchange items must be type "gas"',
        })
      )
      .min(1),
    // Empties REQUIRED
    empties: z.array(returnedItem).min(1, 'Exchange requires returning empties'),
    ...financials.shape,
  })
  .strict();

export const b2cNewSchema = z
  .object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1).optional(),
    // MUST be 'cylinder' (Package)
    items: z
      .array(
        soldItem.refine(i => i.productType === 'cylinder', {
          message: 'New connections must be type "cylinder"',
        })
      )
      .min(1),
    // Empties FORBIDDEN
    empties: z.array(returnedItem).max(0, 'New connections cannot have empty returns'),
    ...financials.shape,
  })
  .strict();

export const b2cProductSchema = z
  .object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1).optional(),
    items: z
      .array(
        soldItem.refine(i => ['stove', 'regulator'].includes(i.productType), {
          message: 'Only stoves/regulators allowed',
        })
      )
      .min(1),
    ...financials.shape,
  })
  .strict();

// ==========================================
// 2. DELIVERY (B2B) SCHEMAS
// ==========================================

const b2bBase = {
  shopId: z.string().min(1),
  vehicleId: z.string().min(1),
};

export const b2bExchangeSchema = z
  .object({
    ...b2bBase,
    items: z
      .array(
        soldItem.refine(i => i.productType === 'gas', {
          message: 'Exchange items must be type "gas"',
        })
      )
      .min(1),
    empties: z.array(returnedItem).min(1),
    ...financials.shape,
  })
  .strict();

export const b2bNewSchema = z
  .object({
    ...b2bBase,
    items: z
      .array(
        soldItem.refine(i => i.productType === 'cylinder', {
          message: 'New connections must be type "cylinder"',
        })
      )
      .min(1),
    empties: z.array(returnedItem).max(0),
    ...financials.shape,
  })
  .strict();

export const b2bProductSchema = z
  .object({
    ...b2bBase,
    items: z
      .array(
        soldItem.refine(i => ['stove', 'regulator'].includes(i.productType), {
          message: 'Only stoves/regulators allowed',
        })
      )
      .min(1),
    ...financials.shape,
  })
  .strict();
