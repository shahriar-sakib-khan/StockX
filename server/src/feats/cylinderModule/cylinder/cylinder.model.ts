import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICylinder extends Document {
  store: Types.ObjectId;
  brand: Types.ObjectId;
  sku: string;
  brandName: string;
  cylinderImage: string;
  cylinderImagePublicId?: string;

  regulatorType: number;
  size: number;
  unit: string;
  price: number;

  fullCount: number;
  emptyCount: number;
  defectedCount: number;

  isActive: boolean;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cylinderSchema: Schema<ICylinder> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'LocalBrand', required: true },

    sku: { type: String, required: true, trim: true },
    brandName: { type: String, required: true, trim: true },
    cylinderImage: { type: String, default: 'cylinderImage' },
    cylinderImagePublicId: { type: String, default: '' },

    regulatorType: { type: Number, required: true },
    size: { type: Number, required: true },
    unit: { type: String, default: 'L' },
    price: { type: Number, required: true },

    fullCount: { type: Number, required: true },
    emptyCount: { type: Number, required: true },
    defectedCount: { type: Number, required: true },

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
