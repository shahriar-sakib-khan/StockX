import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILocalBrand extends Document {
  store: Types.ObjectId;
  globalBrand: Types.ObjectId;

  name: string;
  brandImage: string;
  brandImagePublicId?: string;
  cylinderImage: string;
  cylinderImagePublicId?: string;
  regulatorTypes: string[];
  sizes: number[];
  prices: {
    size: number;
    regulatorType: string;
    price: number;
  }[];

  isActive: boolean;

  createdBy: Types.ObjectId;
  selectedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const localBrandSchema: Schema<ILocalBrand> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    globalBrand: { type: Schema.Types.ObjectId, ref: 'GlobalBrand', required: true },
    name: { type: String, required: true, trim: true },
    brandImage: { type: String, required: true },
    brandImagePublicId: { type: String },
    cylinderImage: { type: String, required: true },
    cylinderImagePublicId: { type: String },
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

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    selectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// localBrandSchema.index({ division: 1, isActive: 1 });

localBrandSchema.methods.toJSON = function (): Partial<ILocalBrand> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<ILocalBrand>;
};

const LocalBrand: Model<ILocalBrand> = mongoose.model<ILocalBrand>('LocalBrand', localBrandSchema);
export default LocalBrand;
