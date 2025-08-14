import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IVehicle extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  regNumber: string;
  brand?: string;
  vehicleModel?: string;

  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema: Schema<IVehicle> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    regNumber: { type: String, required: true },
    brand: String,
    vehicleModel: String,
  },
  { timestamps: true }
);

vehicleSchema.index({ workspaceId: 1, divisionId: 1, regNumber: 1 }, { unique: true });

vehicleSchema.methods.toJSON = function (): Partial<IVehicle> {
  const obj = this.toObject();
  delete obj.__v;
  
  return obj;
};

const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
export default Vehicle;
