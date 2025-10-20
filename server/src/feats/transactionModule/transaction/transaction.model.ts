import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import * as transactionConstants from './transaction.constants.js';

export interface ITransaction extends Document {
  store: Types.ObjectId;

  debitAccountId: Types.ObjectId;
  creditAccountId: Types.ObjectId;

  price?: number;
  quantity?: number;
  totalAmount: number;

  category: transactionConstants.TxCategoryType;
  transactionType: transactionConstants.CategoryTypeType;
  paymentMethod?: transactionConstants.PaymentMethodType;

  counterpartyType: transactionConstants.CounterpartyKindType;
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

    price: { type: Number, min: 0 },
    quantity: { type: Number, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: transactionConstants.TransactionCategory,
      required: true,
      index: true,
    },
    transactionType: {
      type: String,
      enum: transactionConstants.CategoryType,
      required: true,
      index: true,
    },
    paymentMethod: { type: String, enum: transactionConstants.PaymentMethod, default: 'cash' },

    counterpartyType: { type: String, enum: transactionConstants.CounterpartyKind, required: true },
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
