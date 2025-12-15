/**
 * @module transaction.constants
 * @description Master Configuration for Transaction Logic.
 */

// =============================================================================
// 1. FUNDAMENTAL TYPES
// =============================================================================

export const TransactionType = {
  INCOME: 'income', // Cash In
  EXPENSE: 'expense', // Cash Out
  ADJUSTMENT: 'adjustment', // Inventory fix (No cash)
  TRANSFER: 'transfer', // Internal movement
  LIABILITY: 'liability', // Taking a loan / buying on credit
  RECEIVABLE: 'receivable', // Giving credit / selling on due
} as const;

export type TransactionTypeType = (typeof TransactionType)[keyof typeof TransactionType];

export const PaymentMethod = ['cash', 'bank', 'mobile', 'due', 'other'] as const;
export type PaymentMethodType = (typeof PaymentMethod)[number];

// =============================================================================
// 2. MASTER CONFIGURATION MAP
// =============================================================================

export interface TxConfig {
  label: string;
  type: TransactionTypeType;
  descriptionTemplate: string; // {{variable}} will be replaced at runtime
  isSystem?: boolean; // If true, hidden from manual "Add Transaction" dropdowns
}

export const TRANSACTION_CONFIG: Record<string, TxConfig> = {
  /* ======================== CYLINDERS =========================== */
  cylinder_sale_cash: {
    label: 'Cylinder Sale (Cash)',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Cash sale of {{quantity}} cylinders to {{customerName}}',
  },
  cylinder_sale_credit: {
    label: 'Cylinder Sale (Due)',
    type: TransactionType.RECEIVABLE,
    descriptionTemplate: 'Credit sale of {{quantity}} cylinders to {{customerName}}',
  },
  cylinder_purchase_cash: {
    label: 'Cylinder Purchase (Cash)',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{supplierName}}',
  },
  cylinder_purchase_due: {
    label: 'Cylinder Purchase (Due)',
    type: TransactionType.LIABILITY,
    descriptionTemplate: 'Purchased {{quantity}} cylinders on credit from {{supplierName}}',
  },
  cylinder_adjustment_in: {
    label: 'Inventory Adjustment (In)',
    type: TransactionType.ADJUSTMENT,
    descriptionTemplate: 'Manual adjustment: Added {{quantity}} cylinders',
  },
  cylinder_adjustment_out: {
    label: 'Inventory Adjustment (Out)',
    type: TransactionType.ADJUSTMENT,
    descriptionTemplate: 'Manual adjustment: Removed {{quantity}} cylinders',
  },

  /* ======================== REGULATORS & STOVES ======================== */
  regulator_sale_cash: {
    label: 'Regulator Sale',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Sold {{quantity}} regulators',
  },
  stove_sale_cash: {
    label: 'Stove Sale',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Sold {{quantity}} stoves',
  },

  /* ========================== SHOPS ============================ */
  shop_due_payment: {
    label: 'Shop Due Collection',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Collected due payment from shop {{shopName}}',
  },
  shop_cylinder_exchange: {
    label: 'Shop Bulk Exchange',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Bulk exchange with shop {{shopName}}: {{quantity}} cyls',
  },

  /* ========================= VEHICLES =========================== */
  stock_transfer_out: {
    label: 'Stock Transfer (Out)',
    type: TransactionType.TRANSFER, // or ADJUSTMENT
    descriptionTemplate: 'Loaded to Vehicle',
  },
  stock_transfer_in: {
    label: 'Stock Transfer (In)',
    type: TransactionType.TRANSFER,
    descriptionTemplate: 'Unloaded from Vehicle',
  },
  /* ========================== EXPENSES ========================== */
  salary_payment: {
    label: 'Salary Payment',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Salary paid to {{staffName}} for {{month}}',
  },
  fuel_payment: {
    label: 'Vehicle Fuel',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Fuel for {{vehicleReg}}: {{liters}} liters',
  },
  repair_payment: {
    label: 'Vehicle Repair',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Repair for {{vehicleReg}}: {{details}}',
  },
  rent_expense: {
    label: 'Shop/Office Rent',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Rent payment for {{month}}',
  },
  utility_expense: {
    label: 'Utilities (Bill)',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Utility bill payment: {{billType}}',
  },
  transport_expense: {
    label: 'Transport/Carrying',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Carrying cost: {{details}}',
  },
  entertainment_expense: {
    label: 'Entertainment/Snacks',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Office entertainment: {{details}}',
  },
  misc_expense: {
    label: 'Miscellaneous Expense',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Misc: {{details}}',
  },

  /* ========================== OWNER ============================ */
  owner_withdraw: {
    label: 'Owner Withdraw',
    type: TransactionType.EXPENSE,
    descriptionTemplate: 'Withdrawal by owner {{ownerName}}',
  },
  capital_injection: {
    label: 'Capital Injection',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Investment by owner {{ownerName}}',
  },
  invoice_payment_cash: {
    label: 'Invoice Payment (Cash)',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Payment for Invoice #{{invoiceNo}} ({{customerName}})',
    isSystem: true,
  },
  invoice_payment_due: {
    label: 'Invoice Due Record',
    type: TransactionType.RECEIVABLE,
    descriptionTemplate: 'Credit recorded for Invoice #{{invoiceNo}}',
    isSystem: true,
  },
  invoice_repayment: {
    label: 'Due Collection',
    type: TransactionType.INCOME,
    descriptionTemplate: 'Due collection for Invoice #{{invoiceNo}}',
  },
  // ... add other expenses as needed
} as const;

export type TxCategoryType = keyof typeof TRANSACTION_CONFIG;

// =============================================================================
// Deprecated Account Codes - to be deleted later
// =============================================================================
export const AccountCodes = [
  '1000-CASH',
  '1100-AR',
  '1200-INVENTORY-CYLINDERS',
  '1300-INVENTORY-REGULATORS',
  '1400-INVENTORY-STOVES',
  '2000-LIABILITIES',
  '2100-AP',
  '3000-EQUITY',
  '4000-REVENUE-GAS',
  '4100-REVENUE-REGULATORS',
  '4200-REVENUE-STOVES',
  '5000-EXPENSE-SALARY',
  '5100-EXPENSE-RENT',
  '5200-EXPENSE-UTILITIES',
  '5300-EXPENSE-TRANSPORT',
  '5400-EXPENSE-ENTERTAINMENT',
  '5500-EXPENSE-MISC',
] as const;

export type AccountCodeType = (typeof AccountCodes)[number];

export const AccountType = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type AccountTypeType = (typeof AccountType)[keyof typeof AccountType];
