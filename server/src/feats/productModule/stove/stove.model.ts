import { Schema, model, Document, Types } from 'mongoose';

export interface IStove extends Document {
  store: Types.ObjectId;
  name: string;
  image?: string;
  burnerCount: number;

  price: number;
  stockCount: number;
  defectedCount: number;

  updatedBy?: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedAt: Date;
}

const stoveSchema = new Schema<IStove>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    name: { type: String, required: true, trim: true },
    image: { type: String },
    burnerCount: { type: Number, required: true, min: 1 },

    price: { type: Number, required: true, min: 0 },
    stockCount: { type: Number, default: 0 },
    defectedCount: { type: Number, default: 0 },

    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false }
);

const Stove = model<IStove>('Stove', stoveSchema);
export default Stove;
