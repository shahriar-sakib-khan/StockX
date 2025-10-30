/**

* @module transaction.constants
*
* @description
* Centralized transaction-level constants used across all inventory and accounting modules.
* Covers categories, account codes, cash flow types, and payment methods for
* Cylinders, Regulators, and Stoves.
*/

/**
 * ----------------- Transaction Category Types -----------------
 *
 * Organized by product and flow type (retail, wholesale, internal, etc.)
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

  /* ====================== OWNER / CAPITAL ======================= */

  // --- Equity Movements ---
  'owner_withdraw',
  'capital_injection',

  /* ======================= MISCELLANEOUS ======================== */

  // --- Other Income & Misc ---
  'other_income',
  'misc_expense',
];

export type TxCategoryType = (typeof TransactionCategory)[number];

/**

* ----------------- Category Cash Flow Types -----------------
*
* Defines whether a transaction affects cash, non-cash assets, or is neutral.
*/ export const CategoryType = {
  CASH_INFLOW: 'cash_inflow',
  CASH_OUTFLOW: 'cash_outflow',
  NON_CASH: 'non_cash',
} as const;

export type CategoryTypeType = (typeof CategoryType)[keyof typeof CategoryType];

/**

* ----------------- Payment Methods -----------------
*
* Accepted payment methods across modules.
*/
export const PaymentMethod = ['cash', 'bank', 'mobile', 'due', 'non-cash', 'other'] as const;
export type PaymentMethodType = (typeof PaymentMethod)[number];

/**

* ----------------- Counterparty Kinds -----------------
*
* Used to classify transaction participants.
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

/**

* ----------------- Account Types -----------------
*
* Standard accounting categories.
*/
export const AccountType = ['asset', 'liability', 'equity', 'income', 'expense'] as const;
export type AccountTypeType = (typeof AccountType)[number];

/**

* ----------------- Account Codes -----------------
*
* Chart of Accounts (COA) for financial tracking and reporting.
* Prefixed numerically by type for easy sorting.
*/
export const AccountCodes = [
  // ---------------- Assets ----------------
  '1000-ASSET-CASH',
  '1001-ASSET-BANK',
  '1002-ASSET-MOBILE',
  '1100-ASSET-AR',
  // Cylinder
  '1200-INVENTORY-CYL',
  '1201-INVENTORY-CYL-FULL',
  '1202-INVENTORY-CYL-EMPTY',
  '1203-INVENTORY-CYL-DEFECTED',

  // Regulator
  '1300-INVENTORY-REG',
  '1301-INVENTORY-REG-FULL',
  '1302-INVENTORY-REG-DEFECTED',

  // Stove
  '1400-INVENTORY-STOVE',
  '1401-INVENTORY-STOVE-FULL',
  '1402-INVENTORY-STOVE-DEFECTED',

  // ---------------- Liabilities ----------------
  '2100-LIAB-AP',

  // ---------------- Equity ----------------
  '3100-EQUITY-OWNER',
  '3200-EQUITY-CAPITAL',

  // ---------------- Revenue ----------------
  '4100-REV-CYL',
  '4101-REV-REG',
  '4102-REV-STOVE',
  '4200-REV-OTHER',

  // ---------------- Expenses ----------------
  '5000-EXP-SALARY',
  '5001-EXP-FUEL',
  '5002-EXP-REPAIR',
  '5003-EXP-OFFICE',
  '5004-EXP-OTHER',
  '5005-EXP-TRANSPORT',
  '5006-EXP-MAINTENANCE',
  '5007-EXP-UTILITY',

  // ---------------- Miscellaneous ----------------
  '9999-MISC-EXPENSE',
] as const;

export type AccountCodeType = (typeof AccountCodes)[number];

/**

* ----------------- Transaction Category Groups -----------------
*
* For frontend filtering or reporting convenience.
*/ export const CategoryGroups = {
  CYLINDERS: TransactionCategory.filter(c => c.startsWith('cylinder_')),
  REGULATORS: TransactionCategory.filter(c => c.startsWith('regulator_')),
  STOVES: TransactionCategory.filter(c => c.startsWith('stove_')),
  EXPENSES: TransactionCategory.filter(c => c.includes('expense') || c.includes('payment')),
  OWNER: TransactionCategory.filter(c => c.includes('owner') || c.includes('capital')),
} as const;

export type CategoryGroupType = keyof typeof CategoryGroups;
