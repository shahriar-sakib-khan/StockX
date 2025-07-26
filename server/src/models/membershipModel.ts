import mongoose, { Schema, Document, Model } from 'mongoose';

import { WORKSPACE_STATUS } from '@/config/roles.config';

export interface IMembership extends Document {
  user: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  workspaceRoles: string[];
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
    workspaceRoles: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: WORKSPACE_STATUS,
      default: 'active',
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

membershipSchema.pre('save', function (next) {
  this.workspaceRoles = [...new Set(this.workspaceRoles)]; // deduplicate roles
  next();
});

membershipSchema.methods.toJSON = function (): Partial<IMembership> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<IMembership>;
};

const Membership: Model<IMembership> = mongoose.model<IMembership>('Membership', membershipSchema);
export default Membership;
