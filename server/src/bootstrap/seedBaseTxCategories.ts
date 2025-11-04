import { Types } from 'mongoose';

import { TxCategory } from '@/models/index.js';

/**
 * ----------------- Default Transaction Category List -----------------
 * Each category defines its accounting impact and cash flow behavior.
 */
const defaultTxCategoryList = [
  /* ======================== CYLINDERS ======================== */

  // Retail Sales
  {
    code: 'cylinder_sale_cash',
    name: 'Cylinder Sale (Cash)',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '4100-REV-CYL',
    descriptionTemplate: 'Cash sale of {{quantity}} cylinders to {{customerName}}',
    categoryType: 'cash_inflow',
    isActive: true,
  },
  {
    code: 'cylinder_sale_credit',
    name: 'Cylinder Sale (Credit)',
    debitAccountCode: '1100-ASSET-AR',
    creditAccountCode: '4100-REV-CYL',
    descriptionTemplate: 'Credit sale of {{quantity}} cylinders to {{customerName}}',
    categoryType: 'non_cash',
    isActive: true,
  },

  // Swaps
  {
    code: 'cylinder_swap_retail',
    name: 'Cylinder Swap (Retail Gas Sale)',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '4100-REV-CYL',
    descriptionTemplate:
      'Gas-only sale during cylinder swap (empty exchanged for full) — {{quantity}} cylinders sold to {{customerName}}',
    categoryType: 'cash_inflow',
    isActive: true,
  },
  {
    code: 'cylinder_swap_empty',
    name: 'Empty Cylinder Swap (Internal Transfer)',
    debitAccountCode: '1202-INVENTORY-CYL-EMPTY',
    creditAccountCode: '1202-INVENTORY-CYL-EMPTY',
    descriptionTemplate:
      'Transferred {{quantity}} empty cylinders between stores: {{fromStoreName}} → {{toStoreName}}',
    categoryType: 'non_cash',
    isActive: true,
  },

  // Purchases
  {
    code: 'cylinder_purchase_wholesale_cash',
    name: 'Cylinder Purchase (Cash)',
    debitAccountCode: '1201-INVENTORY-CYL-FULL',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{supplierName}} in cash',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'cylinder_purchase_wholesale_ap',
    name: 'Cylinder Purchase (Accounts Payable)',
    debitAccountCode: '1201-INVENTORY-CYL-FULL',
    creditAccountCode: '2100-LIAB-AP',
    descriptionTemplate: 'Purchased {{quantity}} cylinders from {{supplierName}} on credit',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'cylinder_payment_to_supplier',
    name: 'Cylinder Payment to Supplier',
    debitAccountCode: '2100-LIAB-AP',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Paid {{amount}} BDT to {{supplierName}} for cylinders',
    categoryType: 'cash_outflow',
    isActive: true,
  },

  // Adjustments
  {
    code: 'cylinder_adjustment_in',
    name: 'Cylinder Adjustment (In)',
    debitAccountCode: '1201-INVENTORY-CYL-FULL',
    creditAccountCode: '4200-REV-OTHER',
    descriptionTemplate: 'Adjustment increase: {{quantity}} cylinders added to stock',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'cylinder_adjustment_out',
    name: 'Cylinder Adjustment (Out)',
    debitAccountCode: '5004-EXP-OTHER',
    creditAccountCode: '1201-INVENTORY-CYL-FULL',
    descriptionTemplate: 'Adjustment decrease: {{quantity}} cylinders removed from stock',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'cylinder_swap_defected',
    name: 'Cylinder Swap (Defected)',
    debitAccountCode: '1203-INVENTORY-CYL-DEFECTED',
    creditAccountCode: '1201-INVENTORY-CYL-FULL',
    descriptionTemplate: 'Swapped {{quantity}} defected cylinders from {{storeName}}',
    categoryType: 'non_cash',
    isActive: true,
  },

  /* ======================== REGULATORS ======================== */

  // Retail Sales
  {
    code: 'regulator_sale_cash',
    name: 'Regulator Sale (Cash)',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '4101-REV-REG',
    descriptionTemplate: 'Cash sale of {{quantity}} regulators to {{customerName}}',
    categoryType: 'cash_inflow',
    isActive: true,
  },
  {
    code: 'regulator_sale_credit',
    name: 'Regulator Sale (Credit)',
    debitAccountCode: '1100-ASSET-AR',
    creditAccountCode: '4101-REV-REG',
    descriptionTemplate: 'Credit sale of {{quantity}} regulators to {{customerName}}',
    categoryType: 'non_cash',
    isActive: true,
  },

  // Swaps
  {
    code: 'regulator_swap_retail',
    name: 'Regulator Swap (Retail)',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '4101-REV-REG',
    descriptionTemplate: 'Retail regulator swap for {{customerName}}',
    categoryType: 'cash_inflow',
    isActive: true,
  },

  // Purchases
  {
    code: 'regulator_purchase_wholesale_cash',
    name: 'Regulator Purchase (Cash)',
    debitAccountCode: '1300-INVENTORY-REG',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Purchased {{quantity}} regulators from {{supplierName}} in cash',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'regulator_purchase_wholesale_ap',
    name: 'Regulator Purchase (Accounts Payable)',
    debitAccountCode: '1300-INVENTORY-REG',
    creditAccountCode: '2100-LIAB-AP',
    descriptionTemplate: 'Purchased {{quantity}} regulators on credit from {{supplierName}}',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'regulator_payment_to_supplier',
    name: 'Regulator Payment to Supplier',
    debitAccountCode: '2100-LIAB-AP',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Paid {{amount}} BDT to {{supplierName}} for regulators',
    categoryType: 'cash_outflow',
    isActive: true,
  },

  // Adjustments
  {
    code: 'regulator_adjustment_in',
    name: 'Regulator Adjustment (In)',
    debitAccountCode: '1300-INVENTORY-REG',
    creditAccountCode: '4200-REV-OTHER',
    descriptionTemplate: 'Added {{quantity}} regulators to inventory (manual adjustment)',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'regulator_adjustment_out',
    name: 'Regulator Adjustment (Out)',
    debitAccountCode: '5004-EXP-OTHER',
    creditAccountCode: '1300-INVENTORY-REG',
    descriptionTemplate: 'Removed {{quantity}} regulators from inventory (manual adjustment)',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'regulator_swap_defected',
    name: 'Regulator Swap (Defected)',
    debitAccountCode: '1301-INVENTORY-REG-DEFECTED',
    creditAccountCode: '1300-INVENTORY-REG',
    descriptionTemplate:
      'Defected regulator replaced for {{customerName}}, recorded as inventory adjustment',
    categoryType: 'non_cash',
    isActive: true,
  },

  /* ======================== STOVES ======================== */

  // Retail Sales
  {
    code: 'stove_sale_cash',
    name: 'Stove Sale (Cash)',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '4102-REV-STOVE',
    descriptionTemplate: 'Cash sale of {{quantity}} stoves to {{customerName}}',
    categoryType: 'cash_inflow',
    isActive: true,
  },
  {
    code: 'stove_sale_credit',
    name: 'Stove Sale (Credit)',
    debitAccountCode: '1100-ASSET-AR',
    creditAccountCode: '4102-REV-STOVE',
    descriptionTemplate: 'Credit sale of {{quantity}} stoves to {{customerName}}',
    categoryType: 'non_cash',
    isActive: true,
  },

  // Swaps
  {
    code: 'stove_swap_retail',
    name: 'Stove Swap (Retail)',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '4102-REV-STOVE',
    descriptionTemplate: 'Retail stove swap for {{customerName}}',
    categoryType: 'cash_inflow',
    isActive: true,
  },

  // Purchases
  {
    code: 'stove_purchase_wholesale_cash',
    name: 'Stove Purchase (Cash)',
    debitAccountCode: '1400-INVENTORY-STOVE',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Purchased {{quantity}} stoves from {{supplierName}} in cash',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'stove_purchase_wholesale_ap',
    name: 'Stove Purchase (Accounts Payable)',
    debitAccountCode: '1400-INVENTORY-STOVE',
    creditAccountCode: '2100-LIAB-AP',
    descriptionTemplate: 'Purchased {{quantity}} stoves from {{supplierName}} on credit',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'stove_payment_to_supplier',
    name: 'Stove Payment to Supplier',
    debitAccountCode: '2100-LIAB-AP',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Paid {{amount}} BDT to {{supplierName}} for stoves',
    categoryType: 'cash_outflow',
    isActive: true,
  },

  // Adjustments
  {
    code: 'stove_adjustment_in',
    name: 'Stove Adjustment (In)',
    debitAccountCode: '1400-INVENTORY-STOVE',
    creditAccountCode: '4200-REV-OTHER',
    descriptionTemplate: 'Added {{quantity}} stoves to inventory (manual adjustment)',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'stove_adjustment_out',
    name: 'Stove Adjustment (Out)',
    debitAccountCode: '5004-EXP-OTHER',
    creditAccountCode: '1400-INVENTORY-STOVE',
    descriptionTemplate: 'Removed {{quantity}} stoves from inventory (manual adjustment)',
    categoryType: 'non_cash',
    isActive: true,
  },
  {
    code: 'stove_swap_defected',
    name: 'Stove Swap (Defected)',
    debitAccountCode: '1402-INVENTORY-STOVE-DEFECTED',
    creditAccountCode: '1400-INVENTORY-STOVE',
    descriptionTemplate:
      'Defected stove replaced for {{customerName}}, recorded as inventory adjustment',
    categoryType: 'non_cash',
    isActive: true,
  },

  /* ======================== EXPENSES ======================== */
  {
    code: 'salary_payment',
    name: 'Salary Payment',
    debitAccountCode: '5000-EXP-SALARY',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Paid salary {{amount}} to {{staffName}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'repair_payment',
    name: 'Repair Payment',
    debitAccountCode: '5002-EXP-REPAIR',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Payment for repair services — {{details}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'fuel_payment',
    name: 'Fuel Payment',
    debitAccountCode: '5001-EXP-FUEL',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Fuel payment {{amount}} for vehicle {{vehicleId}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'transport_expense',
    name: 'Transport Expense',
    debitAccountCode: '5005-EXP-TRANSPORT',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Transport cost {{amount}} for shipment or delivery',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'maintenance_expense',
    name: 'Maintenance Expense',
    debitAccountCode: '5006-EXP-MAINTENANCE',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Maintenance cost {{amount}} for {{assetName}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'utility_expense',
    name: 'Utility Expense',
    debitAccountCode: '5007-EXP-UTILITY',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Utility payment {{amount}} for {{utilityName}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'office_expense',
    name: 'Office Expense',
    debitAccountCode: '5003-EXP-OFFICE',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Paid office expense: {{note}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'other_expense',
    name: 'Other Expense',
    debitAccountCode: '5004-EXP-OTHER',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Miscellaneous expense: {{note}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },

  /* ======================== OWNER / CAPITAL ======================== */
  {
    code: 'owner_withdraw',
    name: 'Owner Withdrawal',
    debitAccountCode: '3100-EQUITY-OWNER',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Owner withdrew {{amount}} BDT from cash',
    categoryType: 'cash_outflow',
    isActive: true,
  },
  {
    code: 'capital_injection',
    name: 'Capital Injection',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '3200-EQUITY-CAPITAL',
    descriptionTemplate: 'Owner invested {{amount}} BDT into business capital',
    categoryType: 'cash_inflow',
    isActive: true,
  },

  /* ======================== MISCELLANEOUS ======================== */
  {
    code: 'other_income',
    name: 'Other Income',
    debitAccountCode: '1000-ASSET-CASH',
    creditAccountCode: '4200-REV-OTHER',
    descriptionTemplate: 'Received miscellaneous income: {{note}}',
    categoryType: 'cash_inflow',
    isActive: true,
  },
  {
    code: 'misc_expense',
    name: 'Miscellaneous Expense',
    debitAccountCode: '9999-MISC-EXPENSE',
    creditAccountCode: '1000-ASSET-CASH',
    descriptionTemplate: 'Miscellaneous expense — {{details}}',
    categoryType: 'cash_outflow',
    isActive: true,
  },
];

/**

* @function seedBaseTxCategories
* @description
* Seeds the TxCategory collection with default transaction categories.
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
  console.log('[Seed] Inserted extended default TxCategoryList.');
};

export default seedBaseTxCategories;
