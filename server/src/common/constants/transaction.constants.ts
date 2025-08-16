export const TransactionCategory = [
  // ========== Retail Sales ==========
  'cylinder_sale_cash',       // cash retail sales
  'cylinder_sale_credit',     // credit retail sales
  'cylinder_swap_retail',     // cylinder swap in retail

  // ========== Wholesale Purchases ==========
  'cylinder_purchase_wholesale_cash', // buy cylinders in cash
  'cylinder_purchase_wholesale_ap',   // buy cylinders on credit (AP)
  'cylinder_payment_to_supplier',     // pay supplier for earlier purchase

  // ========== Expenses ==========
  'salary_payment',          // staff salaries
  'fuel_payment',            // fuel for vehicles
  'repair_payment',          // vehicle repair/maintenance
  'office_expense',          // office expense

  // ========== Owner/Withdrawal ==========
  'owner_withdraw',          // owner taking out money

  // ========== Miscellaneous ==========
  'other_income',            // miscellaneous income
  'other_expense',           // miscellaneous expense
] as const;

export type TxCategoryType = (typeof TransactionCategory)[number];

export const PaymentMethod = ['cash', 'bank', 'mobile', 'other'] as const;
export type PaymentMethodType = (typeof PaymentMethod)[number];

export const CounterpartyKind = ['customer', 'store', 'internal'] as const;
export type CounterpartyKindType = (typeof CounterpartyKind)[number];

export const AccountType = ['asset', 'liability', 'equity', 'income', 'expense'] as const;
export type AccountTypeType = (typeof AccountType)[number];
