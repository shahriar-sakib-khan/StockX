import { Schema, model, Document, Types } from 'mongoose';

import { MembershipStatus, MembershipStatusType } from './membership.constants.js';

export interface IMembership extends Document {
  store: Types.ObjectId;
  user: Types.ObjectId;

  storeRole: string;
  status: MembershipStatusType;

  invitedBy?: Types.ObjectId | null;
  removedBy?: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

const membershipSchema = new Schema<IMembership>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    storeRole: { type: String, required: true, default: 'admin' },
    status: { type: String, enum: MembershipStatus, default: 'active' },

    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    removedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure one membership per user per store
membershipSchema.index({ store: 1, user: 1 }, { unique: true });

const Membership = model<IMembership>('Membership', membershipSchema);
export default Membership;
