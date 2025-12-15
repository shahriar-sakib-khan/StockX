export const TransactionCategories = {
  // --- SALES (INCOME) ---
  SALE_DIRECT: 'sale_direct', // B2C
  SALE_DELIVERY: 'sale_delivery', // B2B
  DUE_COLLECTION: 'due_collection', // Shop paying off due

  // --- PROCUREMENT (EXPENSE) ---
  PURCHASE_PACKAGE: 'purchase_package', // Buying New Cylinders (Shell+Gas)
  PURCHASE_REFILL: 'purchase_refill', // Refilling Gas (Empty -> Full)
  PURCHASE_PRODUCT: 'purchase_product', // Buying Stoves/Regulators

  // --- OPERATIONAL (EXPENSE) ---
  EXPENSE_FUEL: 'expense_fuel',
  EXPENSE_REPAIR: 'expense_repair',
  EXPENSE_SALARY: 'expense_salary',
  EXPENSE_GENERAL: 'expense_general',

  // --- INTERNAL ---
  STOCK_TRANSFER: 'stock_transfer', // Load/Unload (No financial impact usually)
} as const;

export type TransactionCategoryType =
  (typeof TransactionCategories)[keyof typeof TransactionCategories];
