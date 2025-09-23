import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import {
  TxCategoryType,
  PaymentMethodType,
  CounterpartyKindType,
  TransactionCategory,
  PaymentMethod,
  CounterpartyKind,
} from './transaction.constants';

export interface ITransaction extends Document {
  store: Types.ObjectId;

  debitAccountId: Types.ObjectId;
  creditAccountId: Types.ObjectId;
  amount: number;

  category: TxCategoryType;
  paymentMethod?: PaymentMethodType;

  counterpartyType: CounterpartyKindType;
  staffId?: Types.ObjectId;
  vehicleId?: Types.ObjectId;
  customerId?: Types.ObjectId;
  shopId?: Types.ObjectId; // alias to counterparty
  cylinderId?: Types.ObjectId; // optional for cylinder movements

  transactedBy: Types.ObjectId;
  ref?: string;
  details?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    
    debitAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    creditAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },

    category: { type: String, enum: TransactionCategory, required: true, index: true },
    paymentMethod: { type: String, enum: PaymentMethod, default: 'cash' },

    counterpartyType: { type: String, enum: CounterpartyKind, required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff' },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    cylinderId: { type: Schema.Types.ObjectId, ref: 'Cylinder' },

    transactedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ref: String,
    details: { type: Schema.Types.Map, of: Schema.Types.Mixed },
  },
  { timestamps: true }
);

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
