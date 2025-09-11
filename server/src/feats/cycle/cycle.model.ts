import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICycle extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  name: string; // Example: "January 2025 Cycle"
  month: number; // 1 = January, 12 = December
  year: number; // Example: 2025
  isClosed: boolean; // Whether the cycle is completed/locked

  createdAt: Date;
  updatedAt: Date;
}

const cycleSchema: Schema<ICycle> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },

    name: { type: String, required: true }, // Human-readable identifier
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },

    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

cycleSchema.index({ workspace: 1, division: 1, month: 1, year: 1 }, { unique: true });

cycleSchema.methods.toJSON = function (): Partial<ICycle> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const Cycle: Model<ICycle> = mongoose.model<ICycle>('Cycle', cycleSchema);
export default Cycle;
