import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStaff extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  name: string;
  phone?: string;
  role?: string;
  image?: string;
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
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: String },
    image: { type: String },
    salaryPlan: {
      amount: Number,
      cycle: { type: String, enum: ['monthly'] },
      effectiveFrom: Date,
    },
  },
  { timestamps: true }
);

// staffSchema.index({ workspace: 1, division: 1, name: 1 });

staffSchema.methods.toJSON = function (): Partial<IStaff> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const Staff: Model<IStaff> = mongoose.model<IStaff>('Staff', staffSchema);
export default Staff;
