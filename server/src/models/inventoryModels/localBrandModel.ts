import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILocalBrand extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  name: string;
  image: string;
  globalBrand: Types.ObjectId;
  selectedBy: Types.ObjectId;
  isActive: boolean;
  totalFullCount: number;
  totalEmptyCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const localBrandSchema: Schema<ILocalBrand> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    globalBrand: { type: Schema.Types.ObjectId, ref: 'GlobalBrand', required: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    selectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: false },
    totalFullCount: { type: Number, default: 0 },
    totalEmptyCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

localBrandSchema.index({ division: 1, isActive: 1 });

localBrandSchema.methods.toJSON = function (): Partial<ILocalBrand> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<ILocalBrand>;
};

const LocalBrand: Model<ILocalBrand> = mongoose.model<ILocalBrand>('LocalBrand', localBrandSchema);
export default LocalBrand;
