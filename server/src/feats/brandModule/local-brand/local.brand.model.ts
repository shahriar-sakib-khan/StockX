import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILocalBrand extends Document {
  store: Types.ObjectId;
  globalBrand: Types.ObjectId;

  name: string;
  brandImage: string;
  cylinderImage: string;
  regulatorTypes: string[];
  sizes: number[];
  prices: {
    size: number;
    regulatorType: string;
    price: number;
  }[];

  isActive: boolean;
  totalFullCount: number;
  totalEmptyCount: number;
  selectedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const localBrandSchema: Schema<ILocalBrand> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    globalBrand: { type: Schema.Types.ObjectId, ref: 'GlobalBrand', required: true },
    name: { type: String, required: true, trim: true },
    brandImage: { type: String, default: 'brandImage' },
    cylinderImage: { type: String, default: 'cylinderImage' },
    regulatorTypes: { type: [String], required: true },
    sizes: { type: [Number], required: true },
    prices: [
      {
        size: { type: Number, required: true },
        regulatorType: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    isActive: { type: Boolean, default: false },
    totalFullCount: { type: Number, default: 0 },
    totalEmptyCount: { type: Number, default: 0 },
    selectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
