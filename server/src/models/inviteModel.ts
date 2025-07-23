import mongoose, { Schema, Document } from 'mongoose';

export interface IInvite extends Document {
  email: string;
  user?: mongoose.Types.ObjectId | null;
  workspace: mongoose.Types.ObjectId;
  role: string;
  invitedBy: mongoose.Types.ObjectId;
  status: 'pending' | 'sent' | 'accepted' | 'declined' | 'expired';
  token: string;
  expiresAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IInvite>('Invite', inviteSchema);
