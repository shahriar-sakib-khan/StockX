/**
 * @module transaction.constants
 *
 * @description
 * Centralized transaction-level constants used across all inventory, accounting,
 * and store management modules.
 * Covers categories, account codes, cash flow types, and payment methods for
 * Cylinders, Regulators, Stoves, and related operations.
 */

/* ========================================================================
 * TRANSACTION CATEGORY TYPES
 * =======================================================================
 *
 * Organized by product, flow type, and financial context.
 * Every entry corresponds to a logical business transaction type.
 */

export const TransactionCategory = [
  /* ======================== CYLINDERS =========================== */
  // --- Retail Sales ---
  'cylinder_sale_cash',
  'cylinder_sale_credit',

  // --- Swaps ---
  'cylinder_swap_retail',
  'cylinder_swap_empty',
  'cylinder_swap_defected',

  // --- Purchases ---
  'cylinder_purchase_wholesale_cash',
  'cylinder_purchase_wholesale_ap',
  'cylinder_payment_to_supplier',

  // --- Adjustments ---
  'cylinder_adjustment_in',
  'cylinder_adjustment_out',

  // --- Discounts / Returns / Internal ---
  'cylinder_sale_discount',
  'cylinder_return',
  'cylinder_internal_transfer',

  /* ======================== REGULATORS ========================== */
  // --- Retail Sales ---
  'regulator_sale_cash',
  'regulator_sale_credit',

  // --- Swaps ---
  'regulator_swap_retail',
  'regulator_swap_defected',

  // --- Purchases ---
  'regulator_purchase_wholesale_cash',
  'regulator_purchase_wholesale_ap',
  'regulator_payment_to_supplier',

  // --- Adjustments ---
  'regulator_adjustment_in',
  'regulator_adjustment_out',

  // --- Discounts / Returns / Internal ---
  'regulator_sale_discount',
  'regulator_return',
  'regulator_internal_transfer',

  /* ========================== STOVES ============================ */
  // --- Retail Sales ---
  'stove_sale_cash',
  'stove_sale_credit',

  // --- Swaps ---
  'stove_swap_retail',
  'stove_swap_defected',

  // --- Purchases ---
  'stove_purchase_wholesale_cash',
  'stove_purchase_wholesale_ap',
  'stove_payment_to_supplier',

  // --- Adjustments ---
  'stove_adjustment_in',
  'stove_adjustment_out',

  // --- Discounts / Returns / Internal ---
  'stove_sale_discount',
  'stove_return',
  'stove_internal_transfer',

  /* ========================== SHOPS ============================ */
  // --- Due Clearance ---
  'shop_due_payment', // when shop pays their due

  // --- Cylinder Exchange (Shop Sales) ---
  'shop_cylinder_exchange_cash',
  'shop_cylinder_exchange_credit',

  // --- Shop Purchases (if shops buy regulators/stoves) ---
  'shop_regulator_sale_cash',
  'shop_regulator_sale_credit',
  'shop_stove_sale_cash',
  'shop_stove_sale_credit',

  /* ========================== EXPENSES ========================== */
  // --- Payments / Operating Expenses ---
  'salary_payment',
  'repair_payment',
  'fuel_payment',
  'transport_expense',
  'maintenance_expense',
  'utility_expense',
  'office_expense',
  'other_expense',

  // --- Write-offs / Depreciation ---
  'inventory_writeoff',
  'asset_depreciation',

  /* ====================== OWNER / CAPITAL ======================= */
  // --- Equity Movements ---
  'owner_withdraw',
  'capital_injection',

  /* ======================= TAX & MISC =========================== */
  'tax_payment',
  'tax_collection',
  'misc_expense',
  'misc_adjustment',
  'rounding_difference',
] as const;

export type TxCategoryType = (typeof TransactionCategory)[number];

/* ========================================================================
 * CATEGORY CASH FLOW TYPES
 * =======================================================================
 *
 * Defines how each transaction type affects the company's cashflow.
 */
export const CategoryType = {
  CASH_INFLOW: 'cash_inflow',
  CASH_OUTFLOW: 'cash_outflow',
  NON_CASH: 'non_cash',
} as const;

export type CategoryTypeType = (typeof CategoryType)[keyof typeof CategoryType];

/* ========================================================================
 * PAYMENT METHODS
 * =======================================================================
 *
 * Maps to specific cash/bank accounts under AccountCodes.
 */
export const PaymentMethod = ['cash', 'bank', 'mobile', 'due', 'non-cash', 'other'] as const;
export type PaymentMethodType = (typeof PaymentMethod)[number];

/* ========================================================================
 * COUNTERPARTY KINDS
 * =======================================================================
 *
 * Classifies the source or destination entity of a transaction.
 */
export const CounterpartyKind = [
  'customer',
  'supplier',
  'shop',
  'vehicle',
  'staff',
  'internal',
  'owner',
  'other',
] as const;
export type CounterpartyKindType = (typeof CounterpartyKind)[number];

/* ========================================================================
 * ACCOUNT TYPES
 * =======================================================================
 *
 * Core accounting classification.
 */
export const AccountType = ['asset', 'liability', 'equity', 'income', 'expense'] as const;
export type AccountTypeType = (typeof AccountType)[number];

/* ========================================================================
 * ACCOUNT CODES — Chart of Accounts (COA)
 * =======================================================================
 *
 * Numbered prefixes follow a standard pattern:
 *   1xxx - Assets
 *   2xxx - Liabilities
 *   3xxx - Equity
 *   4xxx - Revenue
 *   5xxx - Expenses
 *   6xxx - Taxes
 *   9xxx - Miscellaneous
 */
export const AccountCodes = [
  /* ======================== ASSETS ======================== */
  '1000-ASSET-CASH',
  '1001-ASSET-CASH-ON-HAND',
  '1002-ASSET-CASH-BANK',
  '1003-ASSET-CASH-MOBILE',
  '1100-ASSET-AR',
  '1101-AR-CUSTOMERS',
  '1102-AR-SHOPS',
  '1201-INVENTORY-CYL-FULL',
  '1202-INVENTORY-CYL-EMPTY',
  '1203-INVENTORY-CYL-DEFECTED',
  '1300-INVENTORY-REG',
  '1301-INVENTORY-REG-DEFECTED',
  '1400-INVENTORY-STOVE',
  '1402-INVENTORY-STOVE-DEFECTED',
  '1500-ASSET-INTERSTORE',
  '1501-ASSET-INTERNAL-TRANSFER',
  '1600-ASSET-FIXED',
  '6001-ASSET-VAT-RECEIVABLE', // Moved up from TAX

  /* ======================== LIABILITIES ======================== */
  '2100-LIAB-AP',
  '2101-AP-SUPPLIERS',
  '2102-AP-STAFF',
  '2103-AP-OWNERS',
  '2104-AP-TAX',
  '6000-LIAB-VAT-PAYABLE',

  /* ======================== EQUITY ======================== */
  '3100-EQUITY-OWNER',
  '3200-EQUITY-CAPITAL',

  /* ======================== REVENUE ======================== */
  '4100-REV-CYL',
  '4101-REV-REG',
  '4102-REV-STOVE',
  '4103-REV-SHOP',
  '4200-REV-OTHER',
  '4201-REV-DISCOUNT',
  '4202-REV-TAX',

  /* ======================== EXPENSES ======================== */
  '5000-EXP-SALARY',
  '5001-EXP-FUEL',
  '5002-EXP-REPAIR',
  '5003-EXP-OFFICE',
  '5004-EXP-OTHER',
  '5005-EXP-TRANSPORT',
  '5006-EXP-MAINTENANCE',
  '5007-EXP-UTILITY',
  '5008-EXP-WRITEOFF',
  '5009-EXP-TAX',
  '5010-EXP-MISC',
  '5600-EXP-DEPRECIATION',

  /* ======================== MISC / SYSTEM ======================== */
  '9999-MISC-EXPENSE',
] as const;

export type AccountCodeType = (typeof AccountCodes)[number];

/* ========================================================================
 * TRANSACTION CATEGORY GROUPS
 * =======================================================================
 *
 * Logical grouping for reporting, filtering, and UI use.
 */
export const CategoryGroups = {
  CYLINDERS: TransactionCategory.filter(c => c.startsWith('cylinder_')),
  REGULATORS: TransactionCategory.filter(c => c.startsWith('regulator_')),
  STOVES: TransactionCategory.filter(c => c.startsWith('stove_')),
  EXPENSES: TransactionCategory.filter(
    c => c.includes('expense') || c.includes('payment') || c.includes('writeoff')
  ),
  OWNER: TransactionCategory.filter(c => c.includes('owner') || c.includes('capital')),
  TAXES: TransactionCategory.filter(c => c.startsWith('tax_')),
  INTERNAL: TransactionCategory.filter(c => c.includes('internal')),
} as const;

export type CategoryGroupType = keyof typeof CategoryGroups;
