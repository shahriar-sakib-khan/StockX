/**
 * @module Vehicle
 *
 * @description
 * Mongoose schema and model for vehicle management.
 * Tracks vehicle details, costs, and association with stores.
 */

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * ----------------- Vehicle Interface -----------------
 */
export interface IVehicle extends Document {
  store: Types.ObjectId;
  regNumber: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  image?: string;
  totalFuelCost: number;
  totalRepairCost: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ----------------- Vehicle Schema -----------------
 */
const vehicleSchema: Schema<IVehicle> = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    regNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      trim: true,
    },
    vehicleBrand: { type: String, trim: true },
    vehicleModel: { type: String, trim: true },
    image: { type: String, default: 'vehicleImageUrl' },

    totalFuelCost: { type: Number, default: 0 },
    totalRepairCost: { type: Number, default: 0 },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * ----------------- Indexes -----------------
 * Ensures a vehicle's registration number is unique per store
 */
// vehicleSchema.index({ store: 1, regNumber: 1 }, { unique: true });

/**
 * ----------------- toJSON Method -----------------
 * Cleans up MongoDB internal fields for API responses
 */
vehicleSchema.methods.toJSON = function (): Partial<IVehicle> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

/**
 * ----------------- Vehicle Model -----------------
 */
const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
export default Vehicle;
