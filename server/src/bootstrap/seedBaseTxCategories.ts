import { Types } from 'mongoose';

import { TxCategory } from '@/models/index.js';

import { CategoryType } from '@/feats/transactionModule/transaction/transaction.constants.js';

/**
 * ----------------- Default Transaction Category List -----------------
 * Each category defines its accounting impact and cash flow behavior.
 */
const defaultTxCategoryList = [
  // ======================== Retail Sales ========================
  {
    code: 'cylinder_sale_cash',
    name: 'Cylinder Sale (Cash)',
    debitAccountCode: '1000-CASH', // Asset ↑ (cash increases)
    creditAccountCode: '4100-REV-CYL', // Income ↑ (revenue recognized)
    descriptionTemplate: 'Cash sale of {{quantity}} cylinders to {{customerName}}',
    categoryType: CategoryType.CASH_INFLOW, // Cash coming in
    isActive: true,
  },
  {
    code: 'cylinder_sale_credit',
    name: 'Cylinder Sale (Credit)',
    debitAccountCode: '1100-AR', // Asset ↑ (accounts receivable increases)
    creditAccountCode: '4100-REV-CYL', // Income ↑ (revenue recognized)
    descriptionTemplate: 'Credit sale of {{quantity}} cylinders to {{customerName}}',
    categoryType: CategoryType.NON_CASH, // No cash movement yet
    isActive: true,
  },
  {
    code: 'cylinder_swap_retail',
    name: 'Cylinder Swap (Retail)',
    debitAccountCode: '1201-INVENTORY-CYL-FULL', // Asset ↑ (full inventory increases)
    creditAccountCode: '1202-INVENTORY-CYL-EMPTY', // Asset ↓ (empty inventory decreases)
    descriptionTemplate: 'Swapped {{quantity}} cylinders for {{customerName}}',
    categoryType: CategoryType.NON_CASH, // Purely internal movement
    isActive: true,
  },

  // ======================== Wholesale Purchases ========================
  {
    code: 'cylinder_purchase_wholesale_cash',
    name: 'Cylinder Purchase (Cash)',
    debitAccountCode: '1200-INVENTORY-CYL', // Asset ↑ (inventory increases)
    creditAccountCode: '1000-CASH', // Asset ↓ (cash decreases)
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{storeName}} in cash',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },
  {
    code: 'cylinder_purchase_wholesale_ap',
    name: 'Cylinder Purchase (AP)',
    debitAccountCode: '1200-INVENTORY-CYL', // Asset ↑ (inventory increases)
    creditAccountCode: '2100-AP', // Liability ↑ (accounts payable increases)
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{storeName}} on credit',
    categoryType: CategoryType.NON_CASH, // No cash yet, liability created
    isActive: true,
  },
  {
    code: 'cylinder_payment_to_supplier',
    name: 'Payment to Supplier',
    debitAccountCode: '2100-AP', // Liability ↓ (we owe less)
    creditAccountCode: '1000-CASH', // Asset ↓ (cash decreases)
    descriptionTemplate: 'Paid {{amount}} BTD to {{storeName}} for previous purchase',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },

  // ======================== Expenses ========================
  {
    code: 'salary_payment',
    name: 'Salary Payment',
    debitAccountCode: '5000-EXP-SALARY', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Paid salary {{amount}} to {{staffName}}',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },
  {
    code: 'fuel_payment',
    name: 'Fuel Payment',
    debitAccountCode: '5001-EXP-FUEL', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Fuel payment {{amount}} for vehicle {{vehicleId}}',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },
  {
    code: 'repair_payment',
    name: 'Repair Payment',
    debitAccountCode: '5002-EXP-REPAIR', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Repair cost {{amount}} for vehicle {{vehicleId}}',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },
  {
    code: 'office_expense',
    name: 'Office Expense',
    debitAccountCode: '5003-EXP-OFFICE', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Paid office expense: {{note}}',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },

  // ======================== Owner / Withdrawal ========================
  {
    code: 'owner_withdraw',
    name: 'Owner Withdrawal',
    debitAccountCode: '3100-EQUITY-OWNER', // Equity ↓
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Owner withdrew {{amount}} BTD from cash',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },

  // ======================== Miscellaneous ========================
  {
    code: 'other_income',
    name: 'Other Income',
    debitAccountCode: '1000-CASH', // Asset ↑
    creditAccountCode: '4200-REV-OTHER', // Income ↑
    descriptionTemplate: 'Received miscellaneous income: {{note}}',
    categoryType: CategoryType.CASH_INFLOW, // Cash coming in
    isActive: true,
  },
  {
    code: 'other_expense',
    name: 'Other Expense',
    debitAccountCode: '5004-EXP-OTHER', // Expense ↑
    creditAccountCode: '1000-CASH', // Asset ↓
    descriptionTemplate: 'Miscellaneous expense: {{note}}',
    categoryType: CategoryType.CASH_OUTFLOW, // Cash going out
    isActive: true,
  },
];

/**
 * @function seedBaseTxCategories
 * @description
 * Seeds the TxCategory collection with default transaction categories.
 * Each category now includes categoryType for cash flow reporting.
 *
 * @param {string} storeId - The ID of the store to seed the categories for.
 */
const seedBaseTxCategories = async (storeId: string): Promise<void> => {
  const count = await TxCategory.countDocuments({ store: storeId });
  if (count > 0) {
    console.log('[Seed] TxCategory collection already seeded.');
    return;
  }

  const categoryListToInsert = defaultTxCategoryList.map(category => ({
    ...category,
    store: new Types.ObjectId(storeId),
  }));

  await TxCategory.insertMany(categoryListToInsert);

  console.log('[Seed] Inserted default TxCategoryList.');
};

export default seedBaseTxCategories;
