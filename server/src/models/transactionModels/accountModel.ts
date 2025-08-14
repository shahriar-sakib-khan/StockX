import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import { txConstants } from '@/common/constants';

export interface IAccount extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  code: string; // e.g., 1000-CASH, 1100-AR, 2100-AP, 4100-REV-GAS
  name: string; // Cash, Bank, AR, AP, Revenue-Gas, Expense-Salary, etc.
  type: txConstants.AccountTypeType; // asset | liability | equity | income | expense
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const accountSchema: Schema<IAccount> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['asset', 'liability', 'equity', 'income', 'expense'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

accountSchema.index({ workspaceId: 1, divisionId: 1, code: 1 }, { unique: true });

accountSchema.methods.toJSON = function (): Partial<IAccount> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const Account: Model<IAccount> = mongoose.model<IAccount>('Account', accountSchema);
export default Account;
