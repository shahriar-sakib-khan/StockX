interface TxCategoryConfig {
  debit: string; // Account code (NOT _id)
  credit: string; // Account code (NOT _id)
  descriptionTemplate?: string; // Optional template for auto description
}

export const txCategoryMap: Record<string, TxCategoryConfig> = {
  // ======================== Retail Sales ========================

  'cylinder-sale-cash': {
    debit: '1000-CASH',
    credit: '4100-REV-CYL',
    descriptionTemplate: 'Cash sale of {{quantity}} cylinders to {{customerName}}',
    // Customer buys cylinders and pays immediately in cash
    // Debit Cash (Asset ↑) because money comes in
    // Credit Revenue (Income ↑) because revenue is recognized
  },
  'cylinder-sale-credit': {
    debit: '1100-AR',
    credit: '4100-REV-CYL',
    descriptionTemplate: 'Credit sale of {{quantity}} cylinders to {{customerName}}',
    // Customer buys cylinders on credit (to pay later)
    // Debit Accounts Receivable (Asset ↑) because we are owed money
    // Credit Revenue (Income ↑) because revenue is recognized immediately
  },
  'cylinder-swap-retail': {
    debit: '1201-INVENTORY-CYL-FULL',
    credit: '1202-INVENTORY-CYL-EMPTY',
    descriptionTemplate: 'Swapped {{quantity}} cylinders for {{customerName}}',
    // Customer swaps empty cylinders for full ones
    // Debit Full Inventory ↑ (we now hold full cylinders)
    // Credit Empty Inventory ↓ (we no longer hold empty cylinders)
  },

  // ======================== Wholesale Purchases ========================

  'cylinder-purchase-wholesale-cash': {
    debit: '1200-INVENTORY-CYL',
    credit: '1000-CASH',
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{storeName}} in cash',
    // Buying cylinders from supplier and paying immediately
    // Debit Inventory ↑ (we now have more stock)
    // Credit Cash ↓ (cash leaves the business)
  },
  'cylinder-purchase-wholesale-ap': {
    debit: '1200-INVENTORY-CYL',
    credit: '2100-AP',
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{storeName}} on credit',
    // Buying cylinders on credit
    // Debit Inventory ↑ (stock increases)
    // Credit Accounts Payable ↑ (liability to supplier)
  },
  'cylinder-payment-to-supplier': {
    debit: '2100-AP',
    credit: '1000-CASH',
    descriptionTemplate: 'Paid {{amount}} BTD to {{storeName}} for previous purchase',
    // Paying a supplier for previously purchased cylinders on credit
    // Debit Accounts Payable ↓ (we owe less)
    // Credit Cash ↓ (cash decreases)
  },

  // ======================== Expenses ========================

  'salary-payment': {
    debit: '5000-EXP-SALARY',
    credit: '1000-CASH',
    descriptionTemplate: 'Paid salary {{amount}} to {{staffName}}',
    // Paying salaries to staff
    // Debit Expense ↑ (record the cost)
    // Credit Cash ↓ (money leaves business)
  },
  'fuel-payment': {
    debit: '5001-EXP-FUEL',
    credit: '1000-CASH',
    descriptionTemplate: 'Fuel payment {{amount}} for vehicle {{vehicleId}}',
    // Fuel purchase for vehicles
    // Debit Expense ↑ (fuel cost)
    // Credit Cash ↓ (cash decreases)
  },
  'repair-payment': {
    debit: '5002-EXP-REPAIR',
    credit: '1000-CASH',
    descriptionTemplate: 'Repair cost {{amount}} for vehicle {{vehicleId}}',
    // Vehicle maintenance & repairs
    // Debit Expense ↑
    // Credit Cash ↓
  },
  'office-expense': {
    debit: '5003-EXP-OFFICE',
    credit: '1000-CASH',
    descriptionTemplate: 'Paid office expense: {{note}}',
    // Miscellaneous office expenses
    // Debit Expense ↑
    // Credit Cash ↓
  },

  // ======================== Owner / Withdrawal ========================

  'owner-withdraw': {
    debit: '3100-EQUITY-OWNER',
    credit: '1000-CASH',
    descriptionTemplate: 'Owner withdrew {{amount}} BTD from cash',
    // Owner withdraws money from the business
    // Debit Owner Equity ↓ (reduces owner's stake)
    // Credit Cash ↓ (cash leaves business)
  },

  // ======================== Miscellaneous ========================

  'other-income': {
    debit: '1000-CASH',
    credit: '4200-REV-OTHER',
    descriptionTemplate: 'Received miscellaneous income: {{note}}',
    // Other income outside regular cylinder sales
    // Debit Cash ↑
    // Credit Other Revenue ↑
  },
  'other-expense': {
    debit: '5004-EXP-OTHER',
    credit: '1000-CASH',
    descriptionTemplate: 'Miscellaneous expense: {{note}}',
    // Other expense not covered elsewhere
    // Debit Expense ↑
    // Credit Cash ↓
  },
};

export interface BaseAccount {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
}

export const baseChartOfAccounts: BaseAccount[] = [
  // ======================== Assets ========================
  { code: '1000-CASH', name: 'Cash', type: 'asset' },
  { code: '1100-AR', name: 'Accounts Receivable', type: 'asset' },
  { code: '1200-INVENTORY-CYL', name: 'Cylinder Inventory', type: 'asset' },
  { code: '1201-INVENTORY-CYL-FULL', name: 'Cylinder Inventory - Full', type: 'asset' },
  { code: '1202-INVENTORY-CYL-EMPTY', name: 'Cylinder Inventory - Empty', type: 'asset' },

  // ======================== Liabilities ========================
  { code: '2100-AP', name: 'Accounts Payable', type: 'liability' },

  // ======================== Equity ========================
  { code: '3100-EQUITY-OWNER', name: 'Owner Equity', type: 'equity' },

  // ======================== Income ========================
  { code: '4100-REV-CYL', name: 'Cylinder Sales Revenue', type: 'income' },
  { code: '4200-REV-OTHER', name: 'Other Income', type: 'income' },

  // ======================== Expenses ========================
  { code: '5000-EXP-SALARY', name: 'Salary Expense', type: 'expense' },
  { code: '5001-EXP-FUEL', name: 'Fuel Expense', type: 'expense' },
  { code: '5002-EXP-REPAIR', name: 'Repair & Maintenance Expense', type: 'expense' },
  { code: '5003-EXP-OFFICE', name: 'Office Expense', type: 'expense' },
  { code: '5004-EXP-OTHER', name: 'Other Expense', type: 'expense' },
];

export default txCategoryMap;
