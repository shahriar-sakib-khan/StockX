import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStaff extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  name: string;
  phone?: string;
  role?: string;
  salaryPlan?: {
    amount: number;
    cycle: 'monthly';
    effectiveFrom: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const staffSchema: Schema<IStaff> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    name: { type: String, required: true },
    phone: String,
    role: String,
    salaryPlan: {
      amount: Number,
      cycle: { type: String, enum: ['monthly'] },
      effectiveFrom: Date,
    },
  },
  { timestamps: true }
);

// staffSchema.index({ workspaceId: 1, divisionId: 1, name: 1 });

staffSchema.methods.toJSON = function (): Partial<IStaff> {
  const obj = this.toObject();
  delete obj.__v;
  
  return obj;
};

const Staff: Model<IStaff> = mongoose.model<IStaff>('Staff', staffSchema);
export default Staff;
