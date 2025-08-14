import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStaffStats extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  staffId: Types.ObjectId;
  totalSalaryPaid: number;
  lastPaidAt?: Date;
  lastUpdatedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const staffStatsSchema: Schema<IStaffStats> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true, index: true },
    totalSalaryPaid: { type: Number, default: 0 },
    lastPaidAt: Date,
    lastUpdatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

// staffStatsSchema.index({ workspaceId: 1, divisionId: 1, staffId: 1 }, { unique: true });

staffStatsSchema.methods.toJSON = function (): Partial<IStaffStats> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const StaffStats: Model<IStaffStats> = mongoose.model<IStaffStats>('StaffStats', staffStatsSchema);

export default StaffStats;
