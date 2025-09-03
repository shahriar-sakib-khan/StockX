import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import { txConstants } from '@/common/constants';

export interface ITransaction extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  // Simple two-sided money (mini debit/credit)
  debitAccountId: Types.ObjectId; // e.g., Cash, AR:CustomerX, Inventory:Gas, Expense:Salary
  creditAccountId: Types.ObjectId; // e.g., Revenue:Gas, AP:StoreY, Cash, Bank
  amount: number;

  category: txConstants.TxCategoryType; // business meaning e.g., "cylinder-sale-cash"
  paymentMethod?: txConstants.PaymentMethodType; // 'cash' | 'bank' | 'mobile' | 'other'

  // Counterparty
  counterpartyType: txConstants.CounterpartyKindType; // 'customer' | 'store' |  'vehicle' | 'staff' | 'internal' | 'other'

  // Additional linkage for UX & reporting
  staffId?: Types.ObjectId; // for salary payments
  vehicleId?: Types.ObjectId; // for fuel/repair
  storeId?: Types.ObjectId; // alias to counterparty when type='store'
  customerId?: Types.ObjectId; // alias to counterparty when type='customer'

  transactedBy: Types.ObjectId;
  ref?: string; // invoice/voucher no

  details?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },

    debitAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    creditAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },

    category: {
      type: String,
      enum: txConstants.TransactionCategory,
      required: true,
      index: true,
    },

    paymentMethod: { type: String, enum: txConstants.PaymentMethod, default: 'cash' },

    counterpartyType: { type: String, enum: txConstants.CounterpartyKind, required: true },

    staffId: { type: Schema.Types.ObjectId, ref: 'Staff' },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },

    transactedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ref: String,

    details: { type: Schema.Types.Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// transactionSchema.index({ workspace: 1, division: 1, createdAt: -1 });
// transactionSchema.index({ workspace: 1, division: 1, counterpartyId: 1, createdAt: -1 });
// transactionSchema.index({ workspace: 1, division: 1, category: 1, createdAt: -1 });

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
