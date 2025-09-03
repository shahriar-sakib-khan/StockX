import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IVehicle extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  regNumber: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  totalFuelCost: number;
  totalRepairCost: number;

  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema: Schema<IVehicle> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    regNumber: { type: String, required: true },
    totalFuelCost: { type: Number, default: 0 },
    totalRepairCost: { type: Number, default: 0 },
    vehicleBrand: { type: String },
    vehicleModel: { type: String },
  },
  { timestamps: true }
);

vehicleSchema.index({ workspace: 1, division: 1, regNumber: 1 }, { unique: true });

vehicleSchema.methods.toJSON = function (): Partial<IVehicle> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
export default Vehicle;
