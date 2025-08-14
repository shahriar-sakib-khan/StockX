import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStore extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  name: string;
  contactName?: string;
  phone?: string;
  address?: string;

  createdAt: Date;
  updatedAt: Date;
}

const storeSchema: Schema<IStore> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    name: { type: String, required: true },
    contactName: String,
    phone: String,
    address: String,
  },
  { timestamps: true }
);

// storeSchema.index({ workspaceId: 1, divisionId: 1, name: 1 });

storeSchema.methods.toJSON = function (): Partial<IStore> {
  const obj = this.toObject();
  delete obj.__v;
  
  return obj;
};

const Store: Model<IStore> = mongoose.model<IStore>('Store', storeSchema);
export default Store;
