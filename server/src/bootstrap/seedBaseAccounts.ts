import { Types } from 'mongoose';

import { Account } from '@/models/index.js';

/**
* ----------------- Default Chart of Accounts -----------------
*/
const defaultChartOfAccounts = [
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

/**
 * @function seedBaseAccounts
 * Seed the ChartOfAccounts collection with default accounts for a store.
 * 
 * @param {string} storeId - The ID of the store to seed the accounts for.
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

  console.log('[Seed] Inserted default BaseAccounts.');
};

export default seedBaseAccounts;
