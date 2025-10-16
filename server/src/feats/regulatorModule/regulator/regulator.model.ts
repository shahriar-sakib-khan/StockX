/**
 * @module Regulator
 *
 * @description
 * Mongoose schema and model for managing gas regulators.
 * Each regulator belongs to a store and tracks inventory and pricing details.
 */

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * ----------------- Regulator Interface -----------------
 */
export interface IRegulator extends Document {
  store: Types.ObjectId; // Reference to parent store

  name: string; // Regulator name or brand
  regulatorImage: string; // Image representing the regulator
  regulatorType: string; // Type/category of regulator
  price: number; // Unit price
  stockCount: number; // Current available stock
  problemCount: number; // Count of cylinders with problems

  createdBy: Types.ObjectId; // Reference to user who created the regulator

  createdAt: Date;
  updatedAt: Date;
}

/**
 * ----------------- Regulator Schema -----------------
 */
const regulatorSchema: Schema<IRegulator> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    name: { type: String, required: [true, 'Regulator name is required'], trim: true },
    regulatorImage: { type: String, default: 'regulatorImage' },
    regulatorType: { type: String, required: [true, 'Regulator type is required'], trim: true },
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
 * Ensures unique regulator name per store
 */
// regulatorSchema.index({ store: 1, name: 1 }, { unique: true });

/**
 * ----------------- toJSON Method -----------------
 * Removes internal fields for cleaner API responses
 */
regulatorSchema.methods.toJSON = function (): Partial<IRegulator> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

/**
 * ----------------- Regulator Model -----------------
 */
const Regulator: Model<IRegulator> = mongoose.model<IRegulator>('Regulator', regulatorSchema);
export default Regulator;
