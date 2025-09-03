import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import { txConstants } from '@/common/constants';

export interface ICounterpartyBalance extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  counterpartyType: txConstants.CounterpartyKindType; // 'customer' | 'store'
  counterpartyId: Types.ObjectId;

  balance: number; // + they owe you (AR), - you owe them (AP)
  totalSales: number; // lifetime sales to them
  totalPurchases: number; // lifetime purchases from them
  totalPaymentsIn: number; // money you received from them
  totalPaymentsOut: number; // money you paid to them
  lastUpdatedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const counterpartyBalanceSchema: Schema<ICounterpartyBalance> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    counterpartyType: { type: String, enum: ['customer', 'store'], required: true },
    counterpartyId: { type: Schema.Types.ObjectId, required: true, index: true },
    balance: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    totalPaymentsIn: { type: Number, default: 0 },
    totalPaymentsOut: { type: Number, default: 0 },
    lastUpdatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

counterpartyBalanceSchema.index(
  { workspace: 1, division: 1, counterpartyType: 1, counterpartyId: 1 },
  { unique: true }
);

counterpartyBalanceSchema.methods.toJSON = function (): Partial<ICounterpartyBalance> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const CounterpartyBalance: Model<ICounterpartyBalance> = mongoose.model<ICounterpartyBalance>(
  'CounterpartyBalance',
  counterpartyBalanceSchema
);
export default CounterpartyBalance;
