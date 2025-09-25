import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import { transactionConstants } from '@/feats/transactionModule/index.js';

export interface ITxCategory extends Document {
  store: Types.ObjectId;

  code: transactionConstants.TxCategoryType;
  name: string;
  categoryType: transactionConstants.CategoryTypeType;
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
    code: { type: String, required: true, enum: transactionConstants.TransactionCategory },
    name: { type: String, required: true },
    categoryType: { type: String, required: true, enum: transactionConstants.CategoryType },
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
