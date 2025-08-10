import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGlobalBrand extends Document {
  name: string;
  regulatorTypes: string[];
  sizes: number[];
  prices: {
    size: number;
    regulatorType: string;
    price: number;
  }[];
}

const globalBrandSchema: Schema<IGlobalBrand> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    regulatorTypes: { type: [String], required: true },
    sizes: { type: [Number], required: true },
    prices: [
      {
        size: { type: Number, required: true },
        regulatorType: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

globalBrandSchema.methods.toJSON = function (): Partial<IGlobalBrand> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<IGlobalBrand>;
};

const GlobalBrand: Model<IGlobalBrand> = mongoose.model<IGlobalBrand>('GlobalBrand', globalBrandSchema);
export default GlobalBrand;
