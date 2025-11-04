/**

* @module regulator.constants
*
* @description
* Constants for regulator-related operations.
* Provides key-value objects instead of plain string arrays for better type safety
* and easier mapping in APIs, UI, and validation.
  */

/**
 * ----------------- Regulator Transaction Categories -----------------
 * Transaction categories based on defaultTxCategoryList
 */
export const RegulatorTxCategory = {
  // ========== Retail Sales ==========
  REGULATOR_SALE_CASH: 'regulator_sale_cash', // Cash sale of regulators
  REGULATOR_SALE_CREDIT: 'regulator_sale_credit', // Credit sale of regulators
  REGULATOR_SWAP_RETAIL: 'regulator_swap_retail', // Retail regulator swap
  REGULATOR_SWAP_DEFECTED: 'regulator_swap_defected', // Swap of defected regulator

  // ========== Wholesale Purchases ==========
  REGULATOR_PURCHASE_WHOLESALE_CASH: 'regulator_purchase_wholesale_cash', // Purchase regulators in cash
  REGULATOR_PURCHASE_WHOLESALE_AP: 'regulator_purchase_wholesale_ap', // Purchase regulators on credit
  REGULATOR_PAYMENT_TO_SUPPLIER: 'regulator_payment_to_supplier', // Pay supplier for regulators

  // ========== Internal Adjustments ==========
  REGULATOR_ADJUSTMENT_IN: 'regulator_adjustment_in', // Add regulators manually to inventory
  REGULATOR_ADJUSTMENT_OUT: 'regulator_adjustment_out', // Remove regulators manually from inventory
} as const;

export type RegulatorTxCategoryType =
  (typeof RegulatorTxCategory)[keyof typeof RegulatorTxCategory];

/**
 * ----------------- Payment Methods -----------------
 */
export const RegulatorPaymentMethod = {
  CASH: 'cash',
  BANK: 'bank',
  MOBILE: 'mobile',
  DUE: 'due',
  NON_CASH: 'non-cash',
  OTHER: 'other',
} as const;

export type RegulatorPaymentMethodType =
  (typeof RegulatorPaymentMethod)[keyof typeof RegulatorPaymentMethod];

/**
 * ----------------- Counterparty Kind -----------------
 */
export const RegulatorCounterpartyKind = {
  CUSTOMER: 'customer',
  STORE: 'store',
  SUPPLIER: 'supplier',
  INTERNAL: 'internal',
} as const;

export type RegulatorCounterpartyKindType =
  (typeof RegulatorCounterpartyKind)[keyof typeof RegulatorCounterpartyKind];
