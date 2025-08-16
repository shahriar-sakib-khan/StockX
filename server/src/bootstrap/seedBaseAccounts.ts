import { Types } from 'mongoose';

import { Account } from '@/models';

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

const seedBaseAccounts = async (workspaceId: string, divisionId: string): Promise<void> => {
  const count = await Account.countDocuments();
  if (count > 0) {
    console.log('[Seed] ChartOfAccounts collection already seeded.');
    return;
  }

  const accountsToInsert = defaultChartOfAccounts.map(account => ({
    ...account,
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  }));

  await Account.insertMany(accountsToInsert);
  console.log('[Seed] Inserted default BaseAccounts.');
};

export default seedBaseAccounts;
