/**
 * ----------------- Transaction Category Types -----------------
 */
export const TransactionCategory = [
  // ========== Retail Sales ==========
  'cylinder_sale_cash', // cash retail sales
  'cylinder_sale_credit', // credit retail sales
  'cylinder_swap_retail', // cylinder swap in retail
  'cylinder_swap_empty', // empty cylinder swap

  // ========== Wholesale Purchases ==========
  'cylinder_purchase_wholesale_cash', // buy cylinders in cash
  'cylinder_purchase_wholesale_ap', // buy cylinders on credit (AP)
  'cylinder_payment_to_supplier', // pay supplier for earlier purchase

  // ========== Expenses ==========
  'salary_payment', // staff salaries
  'fuel_payment', // fuel for vehicles
  'repair_payment', // vehicle repair/maintenance
  'office_expense', // office expense

  // ========== Owner/Withdrawal ==========
  'owner_withdraw', // owner taking out money

  // ========== Miscellaneous ==========
  'other_income', // miscellaneous income
  'other_expense', // miscellaneous expense
] as const;
export type TxCategoryType = (typeof TransactionCategory)[number];

/**
 * ----------------- Category Cash Flow Types -----------------
 */
export const CategoryType = {
  CASH_INFLOW: 'cash_inflow', // Cash coming into the business
  CASH_OUTFLOW: 'cash_outflow', // Cash leaving the business
  NON_CASH: 'non_cash', // Inventory swaps or adjustments, no direct cash impact
} as const;

export type CategoryTypeType = (typeof CategoryType)[keyof typeof CategoryType];

/**
 * ----------------- Other Constants -----------------
 */

export const PaymentMethod = ['cash', 'bank', 'mobile', 'due', 'non-cash', 'other'] as const;
export type PaymentMethodType = (typeof PaymentMethod)[number];

export const CounterpartyKind = [
  'customer',
  'supplier',
  'shop',
  'vehicle',
  'staff',
  'internal',
  'other',
] as const;
export type CounterpartyKindType = (typeof CounterpartyKind)[number];

export const AccountType = ['asset', 'liability', 'equity', 'income', 'expense'] as const;
export type AccountTypeType = (typeof AccountType)[number];

export const AccountCodes = [
  '1000-CASH',
  '1100-AR',
  '1200-INVENTORY-CYL',
  '1201-INVENTORY-CYL-FULL',
  '1202-INVENTORY-CYL-EMPTY',
  '2100-AP',
  '3100-EQUITY-OWNER',
  '4100-REV-CYL',
  '4200-REV-OTHER',
  '5000-EXP-SALARY',
  '5001-EXP-FUEL',
  '5002-EXP-REPAIR',
  '5003-EXP-OFFICE',
  '5004-EXP-OTHER',
] as const;
export type AccountCodeType = (typeof AccountCodes)[number];
