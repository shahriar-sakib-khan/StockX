import mongoose, { Schema, Document, Model, Types } from 'mongoose';

import {
  InviteStatus,
  InviteStatusType,
  InviteLifespan,
  InviteLifespanType,
} from './invite.constants';

export interface IInvite extends Document {
  store: Types.ObjectId;

  email: string;
  user?: Types.ObjectId | null;
  role: string;
  status: InviteStatusType;
  token: string;
  invitedBy: Types.ObjectId;
  lifespan: InviteLifespanType;
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    role: { type: String, required: true },
    status: { type: String, enum: InviteStatus, default: 'pending' },
    token: { type: String, required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    lifespan: {
      type: String,
      enum: InviteLifespan,
      default: '1d',
    },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

inviteSchema.methods.toJSON = function (): Partial<IInvite> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<IInvite>;
};

const Invite: Model<IInvite> = mongoose.model<IInvite>('Invite', inviteSchema);
export default Invite;
