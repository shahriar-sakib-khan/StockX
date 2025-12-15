import { Schema, model, Document, Types } from 'mongoose';

// Sub-schemas for Mobile Inventory
const vehicleCylinderSchema = new Schema(
  {
    cylinderId: { type: Schema.Types.ObjectId, ref: 'Cylinder', required: true }, // Links to the specific Brand/Size type
    fullCount: { type: Number, default: 0 },
    emptyCount: { type: Number, default: 0 },
    defectedCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const vehicleItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true }, // Ref to Stove/Regulator
    quantity: { type: Number, default: 0 },
  },
  { _id: false }
);

export interface IVehicle extends Document {
  store: Types.ObjectId;
  regNumber: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  image?: string;

  // Mobile Inventory
  inventory: {
    cylinders: {
      cylinderId: Types.ObjectId;
      fullCount: number;
      emptyCount: number;
      defectedCount: number;
    }[];
    stoves: {
      productId: Types.ObjectId;
      quantity: number;
    }[];
    regulators: {
      productId: Types.ObjectId;
      quantity: number;
    }[];
  };

  // Stats
  totalFuelCost: number;
  totalRepairCost: number;

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    regNumber: { type: String, required: true, trim: true },
    vehicleBrand: { type: String, trim: true },
    vehicleModel: { type: String, trim: true },
    image: { type: String, trim: true },

    inventory: {
      cylinders: [vehicleCylinderSchema],
      stoves: [vehicleItemSchema],
      regulators: [vehicleItemSchema],
    },

    totalFuelCost: { type: Number, default: 0 },
    totalRepairCost: { type: Number, default: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique registration per store
vehicleSchema.index({ store: 1, regNumber: 1 }, { unique: true });

const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
export default Vehicle;
