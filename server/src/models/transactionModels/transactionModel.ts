import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import { txConstants } from '@/common/constants';

export interface ITransaction extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  // Simple two-sided money (mini debit/credit)
  debitAccountId: Types.ObjectId; // e.g., Cash, AR:CustomerX, Inventory:Gas, Expense:Salary
  creditAccountId: Types.ObjectId; // e.g., Revenue:Gas, AP:StoreY, Cash, Bank
  amount: number;

  category: txConstants.TxCategoryType; // business meaning
  paymentMethod?: txConstants.PaymentMethodType; // 'cash' | 'bank' | 'mobile' | 'other'

  // Counterparty (if applicable)
  counterpartyType?: txConstants.CounterpartyKindType; // 'customer' | 'store' | 'internal'
  counterpartyId?: Types.ObjectId;

  // Additional linkage for UX & reporting
  staffId?: Types.ObjectId; // for salary payments
  vehicleId?: Types.ObjectId; // for fuel/repair
  storeId?: Types.ObjectId; // alias to counterparty when type='store'
  customerId?: Types.ObjectId; // alias to counterparty when type='customer'

  transactedBy: Types.ObjectId;
  ref?: string; // invoice/voucher no

  details?: Record<string, any>; // polymorphic payload (items, cylinderSwap, notes)

  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },

    debitAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    creditAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },

    category: {
      type: String,
      enum: txConstants.TransactionCategory,
      required: true,
      index: true,
    },

    paymentMethod: { type: String, enum: txConstants.PaymentMethod },

    counterpartyType: { type: String, enum: txConstants.CounterpartyKind },
    counterpartyId: { type: Schema.Types.ObjectId },

    staffId: { type: Schema.Types.ObjectId, ref: 'Staff' },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },

    transactedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ref: String,

    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// transactionSchema.index({ workspaceId: 1, divisionId: 1, createdAt: -1 });
// transactionSchema.index({ workspaceId: 1, divisionId: 1, counterpartyId: 1, createdAt: -1 });
// transactionSchema.index({ workspaceId: 1, divisionId: 1, category: 1, createdAt: -1 });

transactionSchema.methods.toJSON = function (): Partial<ITransaction> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema
);
export default Transaction;
