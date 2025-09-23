import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import {
  TxCategoryType,
  TransactionCategory,
} from '../feats/transactionModule/transaction/transaction.constants';

export interface ITxCategory extends Document {
  store: Types.ObjectId;

  code: TxCategoryType;
  name: string;
  descriptionTemplate?: string;
  debitAccountCode: string;
  creditAccountCode: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const txCategorySchema: Schema<ITxCategory> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    code: { type: String, required: true, enum: TransactionCategory },
    name: { type: String, required: true },
    descriptionTemplate: { type: String },
    debitAccountCode: { type: String, required: true },
    creditAccountCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

txCategorySchema.methods.toJSON = function (): Partial<ITxCategory> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const TxCategory: Model<ITxCategory> = mongoose.model<ITxCategory>('TxCategory', txCategorySchema);
export default TxCategory;
