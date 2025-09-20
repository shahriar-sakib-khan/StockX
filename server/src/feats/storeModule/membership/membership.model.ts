import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import { MembershipStatus, MembershipStatusType } from './membership.constants.js';

export interface IMembership extends Document {
  store: Types.ObjectId;
  user: Types.ObjectId;

  storeRoles: string[];
  status: MembershipStatusType;
  invitedBy?: Types.ObjectId | null;
  removedBy?: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

const membershipSchema: Schema<IMembership> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    storeRoles: { type: [String], default: [] },
    status: { type: String, enum: MembershipStatus, default: 'active' },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    removedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

membershipSchema.pre('save', function (next) {
  this.storeRoles = [...new Set(this.storeRoles)]; // deduplicate storeRoles
  next();
});

membershipSchema.methods.toJSON = function (): Partial<IMembership> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<IMembership>;
};

const Membership: Model<IMembership> = mongoose.model<IMembership>('Membership', membershipSchema);
export default Membership;
