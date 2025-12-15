import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import {
  TransactionType,
  PaymentMethod,
  TransactionTypeType,
  PaymentMethodType,
} from './transaction.constants.js';

export interface ITransaction extends Document {
  store: Types.ObjectId;

  category: string;
  type: TransactionTypeType;
  amount: number;
  paymentMethod: PaymentMethodType;

  // --- Context References ---
  invoiceRef?: Types.ObjectId; // Link to Invoice Module

  vehicleId?: Types.ObjectId;
  staffId?: Types.ObjectId;
  shopId?: Types.ObjectId;

  // Metadata
  ref?: string; // External Receipt #
  details?: Record<string, any>;
  performedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    category: { type: String, required: true, index: true },
    type: { type: String, enum: Object.values(TransactionType), required: true, index: true },

    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: PaymentMethod, default: 'cash', required: true },

    invoiceRef: { type: Schema.Types.ObjectId, ref: 'Invoice', index: true },

    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', index: true },

    ref: { type: String, trim: true },
    details: { type: Schema.Types.Mixed, default: {} },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false }
);

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema
);
export default Transaction;
