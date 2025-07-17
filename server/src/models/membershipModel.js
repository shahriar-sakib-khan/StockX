import mongoose from "mongoose";
const { Schema } = mongoose;

import { WORKSPACE_ROLES, WORKSPACE_STATUS } from "../config/roles.config.js";

/**
 * Membership Schema
 */
const membershipSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    role: {
      type: String,
      enum: WORKSPACE_ROLES,
      default: "user",
      required: true,
    },

    status: {
      type: String,
      enum: WORKSPACE_STATUS,
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Membership", membershipSchema);
