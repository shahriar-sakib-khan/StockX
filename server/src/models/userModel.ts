import mongoose, { Document, Schema, Model } from 'mongoose';

import { SUPER_ROLES } from '@/config/roles.config.js';

/**
 * TypeScript Interface for User fields
 * This represents the shape of a User *document* in MongoDB
 */
export interface IUser extends Document {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  address: string;
  role: (typeof SUPER_ROLES)[number]; // restrict role to values in SUPER_ROLES
}

/**
 * User the Schema (Mongoose + TypeScript types)
 */
const userSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },

    lastName: {
      type: String,
      default: '',
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
    },

    role: {
      type: String,
      enum: SUPER_ROLES,
      default: 'user',
    },
  },
  { timestamps: true }
);

/**
 * Instance Method (toJSON override)
 * TypeScript knows `this` is IUser here.
 */
userSchema.methods.toJSON = function (): Omit<IUser, 'password'> {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
