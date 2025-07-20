import mongoose, { Schema, Document, Model } from 'mongoose';

import { TENANT_STATUS } from '@/config/roles.config';

export interface IMembership extends Document {
  user: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  tenantRoles: string[];
  status: 'active' | 'invited';
  invitedBy?: mongoose.Types.ObjectId;
}

const membershipSchema: Schema<IMembership> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    tenantRoles: [{ type: String }],
    status: {
      type: String,
      enum: TENANT_STATUS,
      default: 'active',
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for quick queries and avoiding duplicates
membershipSchema.index({ user: 1, workspace: 1 }, { unique: true });

membershipSchema.pre('save', function (next) {
  this.tenantRoles = Array.from(new Set(this.tenantRoles)); // deduplicate roles
  next();
});

const Membership: Model<IMembership> = mongoose.model<IMembership>('Membership', membershipSchema);
export default Membership;
