import { Schema, model, Document, Types } from 'mongoose';

export interface IRegulator extends Document {
  store: Types.ObjectId;
  name: string;
  image?: string;
  regulatorType: number; // 20, 22

  price: number;
  stockCount: number;
  defectedCount: number;

  updatedBy?: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedAt: Date;
}

const regulatorSchema = new Schema<IRegulator>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    name: { type: String, required: true, trim: true },
    image: { type: String },
    regulatorType: { type: Number, required: true },

    price: { type: Number, required: true, min: 0 },
    stockCount: { type: Number, default: 0 },
    defectedCount: { type: Number, default: 0 },

    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false }
);

const Regulator = model<IRegulator>('Regulator', regulatorSchema);
export default Regulator;
