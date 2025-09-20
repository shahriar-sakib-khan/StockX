import mongoose, { Document, Schema, Model } from 'mongoose';

import { UserRoles, UserRoleType } from './user.constants.js';

/**
 * @interface IUser
 * @description Represents a User document in MongoDB
 */
export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  address?: string;
  image?: string;
  role: UserRoleType;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    username: { type: String, required: [true, 'Username is required'], unique: true, trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, 'Password is required'], select: false },
    address: { type: String, default: '' },
    image: { type: String, default: 'userImageUrl' },
    role: { type: String, enum: UserRoles, default: 'user' },
  },
  { timestamps: true }
);

/**
 * ----------------- Instance Method: toJSON -----------------
 * @description Customizes the JSON response by removing sensitive fields
 */
userSchema.methods.toJSON = function (): Partial<IUser> {
  const obj = this.toObject();

  // Remove sensitive fields
  delete obj.password;
  delete obj.__v;

  // Replace _id with id for cleaner API responses
  obj.id = obj._id;
  delete obj._id;

  return obj as Partial<IUser>;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
