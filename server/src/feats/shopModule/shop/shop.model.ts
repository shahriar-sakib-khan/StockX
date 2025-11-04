/**
 * @module Shop
 *
 * @description
 * Mongoose schema and model for client shop management.
 * Tracks shop info, due balance, and summary stats.
 */

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * ----------------- Shop Interface -----------------
 */
export interface IShop extends Document {
  store: Types.ObjectId;
  shopName: string;
  ownerName?: string;
  phoneNumber?: string;
  location: string;
  image?: string;

  totalDue: number;
  totalPurchases: number;
  totalPayments: number;
  totalDeliveries: number;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ----------------- Shop Schema -----------------
 */
const shopSchema: Schema<IShop> = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    ownerName: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    image: { type: String, default: 'shopImageUrl' },

    totalDue: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    totalPayments: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

/**
 * ----------------- toJSON Method -----------------
 */
shopSchema.methods.toJSON = function (): Partial<IShop> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

/**
 * ----------------- Shop Model -----------------
 */
const Shop: Model<IShop> = mongoose.model<IShop>('Shop', shopSchema);
export default Shop;
