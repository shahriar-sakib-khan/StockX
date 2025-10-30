/**

* @module regulator.constants
*
* @description
* Constants for regulator-related operations.
* Provides key-value objects instead of plain string arrays for better type safety
* and easier mapping in APIs, UI, and validation.
  */

/**

* ----------------- Transaction Categories -----------------
  */
export const RegulatorTxCategory = {
  // ========== Retail Sales ==========
  REGULATOR_SALE_CASH: 'regulator_sale_cash', // cash retail sale
  REGULATOR_SALE_CREDIT: 'regulator_sale_credit', // credit retail sale
  REGULATOR_SWAP_RETAIL: 'regulator_swap_retail', // swap in retail
  REGULATOR_SWAP_DEFECTED: 'regulator_swap_defected', // swap for defected regulator

  // ========== Wholesale Purchases ==========
  REGULATOR_PURCHASE_WHOLESALE_CASH: 'regulator_purchase_wholesale_cash', // buy regulators in cash
  REGULATOR_PURCHASE_WHOLESALE_AP: 'regulator_purchase_wholesale_ap', // buy regulators on credit (AP)
  REGULATOR_PAYMENT_TO_SUPPLIER: 'regulator_payment_to_supplier', // payment to supplier

  // ========== Internal Adjustments ==========
  REGULATOR_ADJUSTMENT_IN: 'regulator_adjustment_in', // manual inventory addition
  REGULATOR_ADJUSTMENT_OUT: 'regulator_adjustment_out', // manual deduction or loss
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
