import { Schema, model, Document } from 'mongoose';

import { UserRoles, UserRoleType } from './user.constants.js';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password?: string;
  address?: string;
  image?: string;
  role: UserRoleType;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    address: { type: String, trim: true },
    image: { type: String, trim: true },
    role: {
      type: String,
      enum: UserRoles,
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model<IUser>('User', userSchema);
export default User;
