export const TransactionCategory = [
  'sale_retail', // shop/retail sales
  'sale_b2b', // store/wholesale sales
  'purchase_bulk_cyl', // buying gas/cylinders from supplier
  'payment_in', // customer/store pays us
  'payment_out', // we pay supplier/other
  'expense_salary',
  'expense_vehicle_fuel',
  'expense_vehicle_repair',
  'expense_other',
  'owner_withdraw',
  'transfer', // cash<->bank<->mobile internal
] as const;
export type TxCategory = (typeof TransactionCategory)[number];

export const PaymentMethod = ['cash', 'bank', 'mobile', 'other'] as const;
export type PaymentMethodType = (typeof PaymentMethod)[number];

export const CounterpartyKind = ['customer', 'store', 'internal'] as const;
export type CounterpartyKindType = (typeof CounterpartyKind)[number];

export const AccountType = ['asset', 'liability', 'equity', 'income', 'expense'] as const;
export type AccountTypeType = (typeof AccountType)[number];
