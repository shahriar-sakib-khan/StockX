import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICylinder extends Document {
  store: Types.ObjectId;
  brand: Types.ObjectId;

  sku: string;
  name: string;
  cylinderImage: string;

  regulatorType: string;
  size: number;
  unit: string;

  price: number;
  count: number;
  isFull: boolean;
  isDefected: boolean;
  isActive: boolean;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const cylinderSchema: Schema<ICylinder> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    brand: { type: Schema.Types.ObjectId, ref: 'LocalBrand', required: true },
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    cylinderImage: { type: String, default: 'cylinderImage' },
    regulatorType: { type: String, required: true, default: '22' },
    size: { type: Number, required: true, default: 12 },
    unit: { type: String, default: 'L' },
    price: { type: Number, required: true, default: 1250 },
    count: { type: Number, default: 0 },
    isFull: { type: Boolean, default: true },
    isDefected: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

cylinderSchema.methods.toJSON = function (): Partial<ICylinder> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Cylinder: Model<ICylinder> = mongoose.model<ICylinder>('Cylinder', cylinderSchema);
export default Cylinder;
