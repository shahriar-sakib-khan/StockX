import { Types } from 'mongoose';

import { TxCategory } from '@/models/index.js';

const defaultTxCategoryList = [
  // ======================== Retail Sales ========================
  {
    code: 'cylinder_sale_cash',
    name: 'Cylinder Sale (Cash)',
    debitAccountCode: '1000-CASH', // Asset ↑ (cash increases)
    creditAccountCode: '4100-REV-CYL', // Income ↑ (revenue recognized)
    descriptionTemplate: 'Cash sale of {{quantity}} cylinders to {{customerName}}',
    isActive: true,
  },
  {
    code: 'cylinder_sale_credit',
    name: 'Cylinder Sale (Credit)',
    debitAccountCode: '1100-AR', // Asset ↑ (accounts receivable increases)
    creditAccountCode: '4100-REV-CYL', // Income ↑ (revenue recognized)
    descriptionTemplate: 'Credit sale of {{quantity}} cylinders to {{customerName}}',
    isActive: true,
  },
  {
    code: 'cylinder_swap_retail',
    name: 'Cylinder Swap (Retail)',
    debitAccountCode: '1201-INVENTORY-CYL-FULL', // Asset ↑ (full inventory increases)
    creditAccountCode: '1202-INVENTORY-CYL-EMPTY', // Asset ↓ (empty inventory decreases)
    descriptionTemplate: 'Swapped {{quantity}} cylinders for {{customerName}}',
    isActive: true,
  },

  // ======================== Wholesale Purchases ========================
  {
    code: 'cylinder_purchase_wholesale_cash',
    name: 'Cylinder Purchase (Cash)',
    debitAccountCode: '1200-INVENTORY-CYL', // Asset ↑ (inventory increases)
    creditAccountCode: '1000-CASH', // Asset ↓ (cash decreases)
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{storeName}} in cash',
    isActive: true,
  },
  {
    code: 'cylinder_purchase_wholesale_ap',
    name: 'Cylinder Purchase (AP)',
    debitAccountCode: '1200-INVENTORY-CYL', // Asset ↑ (inventory increases)
    creditAccountCode: '2100-AP', // Liability ↑ (accounts payable increases)
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{storeName}} on credit',
    isActive: true,
  },
  {
    code: 'cylinder_payment_to_supplier',
    name: 'Payment to Supplier',
    debitAccountCode: '2100-AP', // Liability ↓ (we owe less)
    creditAccountCode: '1000-CASH', // Asset ↓ (cash decreases)
    descriptionTemplate: 'Paid {{amount}} BTD to {{storeName}} for previous purchase',
    isActive: true,
  },

  // ======================== Expenses ========================
  {
    code: 'salary_payment',
    name: 'Salary Payment',
    debitAccountCode: '5000-EXP-SALARY', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Paid salary {{amount}} to {{staffName}}',
    isActive: true,
  },
  {
    code: 'fuel_payment',
    name: 'Fuel Payment',
    debitAccountCode: '5001-EXP-FUEL', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Fuel payment {{amount}} for vehicle {{vehicleId}}',
    isActive: true,
  },
  {
    code: 'repair_payment',
    name: 'Repair Payment',
    debitAccountCode: '5002-EXP-REPAIR', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Repair cost {{amount}} for vehicle {{vehicleId}}',
    isActive: true,
  },
  {
    code: 'office_expense',
    name: 'Office Expense',
    debitAccountCode: '5003-EXP-OFFICE', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Paid office expense: {{note}}',
    isActive: true,
  },

  // ======================== Owner / Withdrawal ========================
  {
    code: 'owner_withdraw',
    name: 'Owner Withdrawal',
    debitAccountCode: '3100-EQUITY-OWNER', // Equity ↓
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Owner withdrew {{amount}} BTD from cash',
    isActive: true,
  },

  // ======================== Miscellaneous ========================
  {
    code: 'other_income',
    name: 'Other Income',
    debitAccountCode: '1000-CASH', // Asset ↑
    creditAccountCode: '4200-REV-OTHER', // Income ↑
    descriptionTemplate: 'Received miscellaneous income: {{note}}',
    isActive: true,
  },
  {
    code: 'other_expense',
    name: 'Other Expense',
    debitAccountCode: '5004-EXP-OTHER', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Miscellaneous expense: {{note}}',
    isActive: true,
  },
];

const seedBaseTxCategories = async (workspaceId: string, divisionId: string): Promise<void> => {
  const count = await TxCategory.countDocuments();
  if (count > 0) {
    console.log('[Seed] TxCategoryList collection already seeded.');
    return;
  }
  const categoryListToInsert = defaultTxCategoryList.map(category => ({
    ...category,
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
  }));
  await TxCategory.insertMany(categoryListToInsert);
  console.log('[Seed] Inserted default TxCategoryList.');
};

export default seedBaseTxCategories;
