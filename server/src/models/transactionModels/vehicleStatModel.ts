import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IVehicleStats extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  vehicleId: Types.ObjectId;
  totalFuelCost: number;
  totalRepairCost: number;
  lastUpdatedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const vehicleStatsSchema: Schema<IVehicleStats> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
    totalFuelCost: { type: Number, default: 0 },
    totalRepairCost: { type: Number, default: 0 },
    lastUpdatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

vehicleStatsSchema.index({ workspace: 1, division: 1, vehicleId: 1 }, { unique: true });

vehicleStatsSchema.methods.toJSON = function (): Partial<IVehicleStats> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const VehicleStats: Model<IVehicleStats> = mongoose.model<IVehicleStats>(
  'VehicleStats',
  vehicleStatsSchema
);
export default VehicleStats;
