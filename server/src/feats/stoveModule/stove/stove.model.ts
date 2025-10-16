/**
 * @module Stove
 *
 * @description
 * Mongoose schema and model for managing stoves.
 * Each stove belongs to a store and tracks inventory and pricing details.
 */

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * ----------------- Stove Interface -----------------
 */
export interface IStove extends Document {
  store: Types.ObjectId; // Reference to parent store

  name: string; // Stove name or brand
  stoveImage: string; // Image representing the stove
  burnerType: string; // Type/category of stove burner
  price: number; // Unit price
  stockCount: number; // Current available stock
  problemCount: number; // Count of defective or returned stoves

  createdBy: Types.ObjectId; // Reference to user who created the stove

  createdAt: Date;
  updatedAt: Date;
}

/**
 * ----------------- Stove Schema -----------------
 */
const stoveSchema: Schema<IStove> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    name: { type: String, required: [true, 'Stove name is required'], trim: true },
    stoveImage: { type: String, default: 'stoveImage' },
    burnerType: { type: String, required: [true, 'Burner type is required'], trim: true },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stockCount: { type: Number, default: 0, min: [0, 'Stock count cannot be negative'] },
    problemCount: { type: Number, default: 0, min: [0, 'Problem count cannot be negative'] },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

/**
 * ----------------- Indexes -----------------
 * Ensures unique stove name per store
 */
// stoveSchema.index({ store: 1, name: 1 }, { unique: true })

/**
 * ----------------- toJSON Method -----------------
 * Removes internal fields for cleaner API responses
 */
stoveSchema.methods.toJSON = function (): Partial<IStove> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

/**
 * ----------------- Stove Model -----------------
 */
const Stove: Model<IStove> = mongoose.model<IStove>('Stove', stoveSchema);
export default Stove;
