import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ISalary extends Document {
  member: Types.ObjectId; // Division member reference
  division: Types.ObjectId;
  workspace: Types.ObjectId;

  cycle: Types.ObjectId; // Reference to Cycle
  monthlySalary: number;

  paidAmount: number; // Total paid in this cycle
  dueAmount: number; // monthlySalary - paidAmount, auto-calculated
  isPaid: boolean; // true if fully paid

  createdAt: Date;
  updatedAt: Date;
}

const salarySchema: Schema<ISalary> = new Schema(
  {
    member: { type: Schema.Types.ObjectId, ref: 'DivisionMember', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    cycle: { type: Schema.Types.ObjectId, ref: 'Cycle', required: true, index: true },

    monthlySalary: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, required: true, default: 0, min: 0 },
    dueAmount: {
      type: Number,
      default: function () {
        return this.monthlySalary - this.paidAmount;
      },
      min: 0,
    },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optional: Composite unique index to ensure one record per member per cycle
// salarySchema.index({ member: 1, cycle: 1 }, { unique: true });

salarySchema.methods.toJSON = function (): Partial<ISalary> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Pre-save middleware to update dueAmount and isPaid
salarySchema.pre<ISalary>('save', function (next) {
  this.dueAmount = Math.max(this.monthlySalary - this.paidAmount, 0);
  this.isPaid = this.dueAmount === 0;
  next();
});

const Salary: Model<ISalary> = mongoose.model<ISalary>('Salary', salarySchema);
export default Salary;
