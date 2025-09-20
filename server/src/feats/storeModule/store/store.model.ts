import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import { Membership } from '../index.js';

export interface IStore extends Document {
  name: string;
  description?: string;
  image?: string;
  location: string;
  phone: string;
  createdBy: Types.ObjectId;
  storeRoles: { name: string; permissions: string[]; _id?: Types.ObjectId }[];

  createdAt: Date;
  updatedAt: Date;
}

const storeSchema: Schema<IStore> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    description: { type: String, default: '' },
    image: { type: String, default: 'storeImageUrl' },
    location: { type: String, required: [true, 'Location is required'] },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?\d{10,15}$/, 'Invalid phone number format'],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    storeRoles: [
      {
        name: { type: String, required: true },
        permissions: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

// storeSchema.index({ workspace: 1, name: 1 }, { unique: true });

/**
 * ----------------- Pre-save Hook -----------------
 * Seed with base roles if none provided
 */
storeSchema.pre('save', function (next) {
  if (!this.storeRoles || this.storeRoles.length === 0) {
    this.storeRoles = [
      { name: 'owner', permissions: ['*'] },
      { name: 'admin', permissions: ['manage_store', 'assign_roles'] },
      { name: 'manager', permissions: ['manage_store', 'assign_roles'] },
      { name: 'staff', permissions: [] },
      { name: 'driver', permissions: [] },
    ];
  }
  next();
});

/**
 * ----------------- Pre-delete Hook -----------------
 * Remove all store memberships when a store is deleted
 */
storeSchema.pre('findOneAndDelete', async function (next) {
  const storeId = this.getQuery()['_id'];
  await Membership.deleteMany({ store: storeId });
  next();
});

storeSchema.methods.toJSON = function (): Partial<IStore> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<IStore>;
};

const Store: Model<IStore> = mongoose.model<IStore>('Store', storeSchema);
export default Store;
