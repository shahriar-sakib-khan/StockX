import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocalBrand extends Document {
  globalBrand: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  division: mongoose.Types.ObjectId;
  selectedBy: mongoose.Types.ObjectId;
  isActive: boolean;
}

const localBrandSchema: Schema<ILocalBrand> = new Schema(
  {
    globalBrand: { type: Schema.Types.ObjectId, ref: 'GlobalBrand', required: true },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    selectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: false },
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
