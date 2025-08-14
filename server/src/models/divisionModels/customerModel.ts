import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICustomer extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  name: string;
  phone?: string;
  address?: string;

  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    name: { type: String, required: true },
    phone: String,
    address: String,
  },
  { timestamps: true }
);

// customerSchema.index({ workspaceId: 1, divisionId: 1, name: 1 });

customerSchema.methods.toJSON = function (): Partial<ICustomer> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const Customer: Model<ICustomer> = mongoose.model<ICustomer>('Customer', customerSchema);
export default Customer;
