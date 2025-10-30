import { Types } from 'mongoose';
import { Account } from '@/models/index.js';

/**
 * ----------------- Default Chart of Accounts -----------------
 *
 * Each entry defines the accounting code, type, and label.
 * This chart covers Cash, Bank, Mobile, AR, Inventory, Liabilities, Equity,
 * Revenues, and Expenses, synchronized with the AccountCodes enum.
 */
export const defaultChartOfAccounts = [
  /* ======================== ASSETS ======================== */
  { code: '1000-ASSET-CASH', name: 'Cash', type: 'asset' },
  { code: '1001-ASSET-BANK', name: 'Bank Account', type: 'asset' },
  { code: '1002-ASSET-MOBILE', name: 'Mobile Wallet (bKash/Nagad)', type: 'asset' },
  { code: '1100-ASSET-AR', name: 'Accounts Receivable', type: 'asset' },

  // ---------------- Cylinder Inventory ----------------
  { code: '1200-INVENTORY-CYL', name: 'Cylinder Inventory (General)', type: 'asset' },
  { code: '1201-INVENTORY-CYL-FULL', name: 'Cylinder Inventory - Full', type: 'asset' },
  { code: '1202-INVENTORY-CYL-EMPTY', name: 'Cylinder Inventory - Empty', type: 'asset' },
  { code: '1203-INVENTORY-CYL-DEFECTED', name: 'Cylinder Inventory - Defected', type: 'asset' },

  // ---------------- Regulator Inventory ----------------
  { code: '1300-INVENTORY-REG', name: 'Regulator Inventory (General)', type: 'asset' },
  { code: '1301-INVENTORY-REG-FULL', name: 'Regulator Inventory - Full', type: 'asset' },
  { code: '1302-INVENTORY-REG-DEFECTED', name: 'Regulator Inventory - Defected', type: 'asset' },

  // ---------------- Stove Inventory ----------------
  { code: '1400-INVENTORY-STOVE', name: 'Stove Inventory (General)', type: 'asset' },
  { code: '1401-INVENTORY-STOVE-FULL', name: 'Stove Inventory - Full', type: 'asset' },
  { code: '1402-INVENTORY-STOVE-DEFECTED', name: 'Stove Inventory - Defected', type: 'asset' },

  /* ======================== LIABILITIES ======================== */
  { code: '2100-LIAB-AP', name: 'Accounts Payable', type: 'liability' },

  /* ======================== EQUITY ======================== */
  { code: '3100-EQUITY-OWNER', name: 'Owner Equity', type: 'equity' },
  { code: '3200-EQUITY-CAPITAL', name: 'Capital Injection', type: 'equity' },

  /* ======================== INCOME ======================== */
  { code: '4100-REV-CYL', name: 'Cylinder Sales Revenue', type: 'income' },
  { code: '4101-REV-REG', name: 'Regulator Sales Revenue', type: 'income' },
  { code: '4102-REV-STOVE', name: 'Stove Sales Revenue', type: 'income' },
  { code: '4200-REV-OTHER', name: 'Other Income', type: 'income' },

  /* ======================== EXPENSES ======================== */
  { code: '5000-EXP-SALARY', name: 'Salary Expense', type: 'expense' },
  { code: '5001-EXP-FUEL', name: 'Fuel Expense', type: 'expense' },
  { code: '5002-EXP-REPAIR', name: 'Repair & Maintenance Expense', type: 'expense' },
  { code: '5003-EXP-OFFICE', name: 'Office Expense', type: 'expense' },
  { code: '5004-EXP-OTHER', name: 'Other Expense', type: 'expense' },
  { code: '5005-EXP-TRANSPORT', name: 'Transport Expense', type: 'expense' },
  { code: '5006-EXP-MAINTENANCE', name: 'Maintenance Expense', type: 'expense' },
  { code: '5007-EXP-UTILITY', name: 'Utility Expense', type: 'expense' },

  /* ======================== MISCELLANEOUS ======================== */
  { code: '9999-MISC-EXPENSE', name: 'Miscellaneous Expense', type: 'expense' },
];

/**
 * @function seedBaseAccounts
 * Seeds the ChartOfAccounts collection with default accounts for a store.
 *
 * @param {string} storeId - The ID of the store to seed accounts for.
 */
const seedBaseAccounts = async (storeId: string): Promise<void> => {
  const count = await Account.countDocuments({ store: storeId });
  if (count > 0) {
    console.log('[Seed] ChartOfAccounts collection already seeded.');
    return;
  }

  const accountsToInsert = defaultChartOfAccounts.map(account => ({
    ...account,
    store: new Types.ObjectId(storeId),
  }));

  await Account.insertMany(accountsToInsert);

  console.log('[Seed] Inserted default Chart of Accounts for store.');
};

export default seedBaseAccounts;
