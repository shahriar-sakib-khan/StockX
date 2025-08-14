import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IVehicleStats extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  vehicleId: Types.ObjectId;
  totalFuelCost: number;
  totalRepairCost: number;
  lastUpdatedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const vehicleStatsSchema: Schema<IVehicleStats> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
    totalFuelCost: { type: Number, default: 0 },
    totalRepairCost: { type: Number, default: 0 },
    lastUpdatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

vehicleStatsSchema.index({ workspaceId: 1, divisionId: 1, vehicleId: 1 }, { unique: true });

vehicleStatsSchema.methods.toJSON = function (): Partial<IVehicleStats> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const VehicleStats: Model<IVehicleStats> = mongoose.model<IVehicleStats>('VehicleStats', vehicleStatsSchema);
export default VehicleStats;
