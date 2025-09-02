import { txConstants } from '@/common/constants';
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITxCategory extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  code: txConstants.TxCategoryType; // e.g., "cylinder-sale-cash"
  name: string; // human-readable name
  debitAccountCode: string; // '1000-CASH'
  creditAccountCode: string; // '4100-REV-CYL'
  descriptionTemplate?: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const txCategorySchema: Schema<ITxCategory> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', index: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    debitAccountCode: { type: String, required: true },
    creditAccountCode: { type: String, required: true },
    descriptionTemplate: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

txCategorySchema.methods.toJSON = function (): Partial<ITxCategory> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const TxCategory: Model<ITxCategory> = mongoose.model('TxCategory', txCategorySchema);
export default TxCategory;
