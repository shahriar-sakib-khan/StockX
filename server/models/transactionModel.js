import mongoose from "mongoose";
const { Schema } = mongoose;

import { PAYMENT_GATEWAY, TRANSACTION_STATUS } from "../config/payment.config.js";

/**
 * Transaction Schema — Clean, Audit-Proof
 */
const transactionSchema = new Schema(
  {
    // Permanent linkage
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment Details
    tran_id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },

    // Transaction Lifecycle Status
    status: {
      type: String,
      enum: TRANSACTION_STATUS,
      default: "pending",
    },

    // Purpose Tracking
    purpose: { type: String, required: true }, // e.g., 'admin_upgrade', 'subscription'

    // Snapshot Data (for audit, not user linkage)
    email: String,
    phone: String,

    // Raw Payment Gateway Response for forensic audits
    gateway: { type: String, enum: PAYMENT_GATEWAY, default: "SSLCOMMERZ" },
    raw_payload: { type: Schema.Types.Mixed },

  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
