import { Schema, model, Document, Types } from 'mongoose';

export interface ICylinder extends Document {
  store: Types.ObjectId;
  brand: Types.ObjectId;

  // Snapshot Data
  sku: string;
  brandName: string;
  cylinderImage: string;

  // Specs
  regulatorType: number; // 20, 22
  size: number; // 12, 35, 45
  unit: string; // 'kg'
  price: number;

  // Inventory
  fullCount: number;
  emptyCount: number;
  defectedCount: number;

  isActive: boolean;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const cylinderSchema = new Schema<ICylinder>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    brand: { type: Schema.Types.ObjectId, ref: 'LocalBrand', required: true },

    sku: { type: String, required: true, trim: true },
    brandName: { type: String, required: true },
    cylinderImage: { type: String, default: '' },

    regulatorType: { type: Number, required: true },
    size: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    price: { type: Number, required: true },

    fullCount: { type: Number, default: 0 },
    emptyCount: { type: Number, default: 0 },
    defectedCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Index for fast lookups during sales
cylinderSchema.index({ store: 1, isActive: 1 });

const Cylinder = model<ICylinder>('Cylinder', cylinderSchema);
export default Cylinder;
