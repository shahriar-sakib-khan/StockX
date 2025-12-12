import { Schema, model, Document, Types } from 'mongoose';

export interface IStoreRole {
  name: string;
  permissions: string[];
}

export interface IStore extends Document {
  name: string;
  storeCode: string; // e.g., "BK-8821"
  description?: string;
  image?: string;
  location: string;
  phone: string;
  createdBy: Types.ObjectId;
  storeRoles: IStoreRole[];
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, trim: true },

    storeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    description: { type: String, default: '' },
    image: { type: String, default: '' },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    storeRoles: [
      {
        name: { type: String, required: true },
        permissions: [{ type: String }],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Store = model<IStore>('Store', storeSchema);
export default Store;
