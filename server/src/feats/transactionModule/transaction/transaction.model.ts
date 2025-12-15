import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import {
  TransactionType,
  PaymentMethod,
  TransactionTypeType,
  PaymentMethodType,
} from './transaction.constants.js';

export interface ITransaction extends Document {
  store: Types.ObjectId;

  category: string; // matches a key in TRANSACTION_CONFIG
  type: TransactionTypeType; // 'income', 'expense', etc. (Derived from config)

  amount: number;
  quantity?: number; // Optional unit count
  paymentMethod: PaymentMethodType;

  vehicleId?: Types.ObjectId;
  staffId?: Types.ObjectId;
  customerId?: Types.ObjectId;
  shopId?: Types.ObjectId;
  cylinderId?: Types.ObjectId;

  ref?: string; // External Invoice/Memo Reference
  details?: Record<string, any>; // Flexible object for extra data

  performedBy: Types.ObjectId; // User/Staff who executed the action

  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },

    category: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      index: true,
    },

    amount: { type: Number, required: true, min: 0 },
    quantity: { type: Number },
    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      default: 'cash',
      required: true,
    },

    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', index: true },
    cylinderId: { type: Schema.Types.ObjectId, ref: 'Cylinder', index: true },

    ref: { type: String, trim: true },
    details: { type: Schema.Types.Mixed, default: {} },

    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Analytics Indexes
transactionSchema.index({ store: 1, type: 1, createdAt: -1 }); // Financial Stats
transactionSchema.index({ store: 1, category: 1, createdAt: -1 }); // Category Stats

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema
);
export default Transaction;
