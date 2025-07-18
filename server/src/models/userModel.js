import mongoose from "mongoose";
const { Schema } = mongoose;

import { SUPER_ROLES } from "../config/roles.config.js";

/**
 * User Schema — With global superRole
 */
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },

    lastName: {
      type: String,
      default: "",
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    superRole: {
      type: String,
      enum: SUPER_ROLES,
      default: "user",
    },
  },
  { timestamps: true }
);

// Removes password before sending response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
