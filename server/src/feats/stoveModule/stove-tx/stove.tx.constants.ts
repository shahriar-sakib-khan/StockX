/**
 * @module stoveTx.constants
 *
 * @description
 * Constants for stove-related transactions.
 */

/**
 * ----------------- Stove Transaction Categories -----------------
 * Transaction categories based on defaultTxCategoryList
 */
export const StoveTxCategory = {
  // ========== Retail Sales ==========
  STOVE_SALE_CASH: 'stove_sale_cash', // Cash sale of stoves
  STOVE_SALE_CREDIT: 'stove_sale_credit', // Credit sale of stoves
  STOVE_SWAP_RETAIL: 'stove_swap_retail', // Retail stove swap
  STOVE_SWAP_DEFECTED: 'stove_swap_defected', // Swap of defected stove

  // ========== Wholesale Purchases ==========
  STOVE_PURCHASE_WHOLESALE_CASH: 'stove_purchase_wholesale_cash', // Purchase stoves in cash
  STOVE_PURCHASE_WHOLESALE_AP: 'stove_purchase_wholesale_ap', // Purchase stoves on credit
  STOVE_PAYMENT_TO_SUPPLIER: 'stove_payment_to_supplier', // Pay supplier for stoves

  // ========== Internal Adjustments ==========
  STOVE_ADJUSTMENT_IN: 'stove_adjustment_in', // Add stoves manually to inventory
  STOVE_ADJUSTMENT_OUT: 'stove_adjustment_out', // Remove stoves manually from inventory
} as const;

export type StoveTxCategoryType = (typeof StoveTxCategory)[keyof typeof StoveTxCategory];

/**
 * ----------------- Payment Methods -----------------
 */
export const StovePaymentMethod = {
  CASH: 'cash',
  BANK: 'bank',
  MOBILE: 'mobile',
  DUE: 'due',
  NON_CASH: 'non-cash',
  OTHER: 'other',
} as const;

export type StovePaymentMethodType = (typeof StovePaymentMethod)[keyof typeof StovePaymentMethod];

/**
 * ----------------- Counterparty Kind -----------------
 */
export const StoveCounterpartyKind = {
  CUSTOMER: 'customer',
  STORE: 'store',
  SUPPLIER: 'supplier',
  INTERNAL: 'internal',
} as const;

export type StoveCounterpartyKindType =
  (typeof StoveCounterpartyKind)[keyof typeof StoveCounterpartyKind];
