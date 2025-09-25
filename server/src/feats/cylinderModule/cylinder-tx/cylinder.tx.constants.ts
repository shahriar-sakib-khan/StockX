/**
 * @module cylinder.constants
 *
 * @description
 * Constants for cylinder-related operations.
 * Provides key-value objects instead of plain string arrays for better type safety
 * and easier mapping in APIs, UI, and validation.
 */

/**
 * ----------------- Transaction Categories -----------------
 */
export const CylinderTxCategory = {
  // ========== Retail Sales ==========
  CYLINDER_SALE_CASH: 'cylinder_sale_cash', // cash retail sales
  CYLINDER_SALE_CREDIT: 'cylinder_sale_credit', // credit retail sales
  CYLINDER_SWAP_RETAIL: 'cylinder_swap_retail', // cylinder swap in retail

  // ========== Wholesale Purchases ==========
  CYLINDER_PURCHASE_WHOLESALE_CASH: 'cylinder_purchase_wholesale_cash', // buy cylinders in cash
  CYLINDER_PURCHASE_WHOLESALE_AP: 'cylinder_purchase_wholesale_ap', // buy cylinders on credit (AP)
  CYLINDER_PAYMENT_TO_SUPPLIER: 'cylinder_payment_to_supplier', // pay supplier for earlier purchase
} as const;

export type CylinderTxCategoryType = (typeof CylinderTxCategory)[keyof typeof CylinderTxCategory];

/**
 * ----------------- Payment Methods -----------------
 */
export const CylinderPaymentMethod = {
  CASH: 'cash',
  BANK: 'bank',
  MOBILE: 'mobile',
  DUE: 'due',
  OTHER: 'other',
} as const;

export type CylinderPaymentMethodType =
  (typeof CylinderPaymentMethod)[keyof typeof CylinderPaymentMethod];

/**
 * ----------------- Counterparty Kind -----------------
 */
export const CylinderCounterpartyKind = {
  CUSTOMER: 'customer',
  STORE: 'store',
  SUPPLIER: 'supplier',
} as const;

export type CylinderCounterpartyKindType =
  (typeof CylinderCounterpartyKind)[keyof typeof CylinderCounterpartyKind];
