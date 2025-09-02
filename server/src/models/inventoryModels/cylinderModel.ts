import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICylinder extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  name: string;
  image: string;
  sku: string;
  brand: Types.ObjectId;
  regulatorType: string;
  size: number;
  unit: string;
  isFull: boolean;
  count: number;
  isActive: boolean;
  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const cylinderSchema: Schema<ICylinder> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    brand: { type: Schema.Types.ObjectId, ref: 'LocalBrand', required: true },
    regulatorType: { type: String, required: true, default: '22' },
    size: { type: Number, required: true, default: 12 },
    unit: { type: String, default: 'L' },
    isFull: { type: Boolean, default: true },
    count: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
