import mongoose, { Document, Schema, Model } from 'mongoose';
import Membership from './membershipModel';

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  customWorkspaceRoles: { name: string; permissions: string[] }[];
}

const workspaceSchema: Schema<IWorkspace> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customWorkspaceRoles: [
      {
        name: { type: String, required: true },
        permissions: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

// Pre-save Hook → Seed with base roles if none provided
workspaceSchema.pre('save', function (next) {
  if (!this.customWorkspaceRoles || this.customWorkspaceRoles.length === 0) {
    this.customWorkspaceRoles = [
      { name: 'admin', permissions: ['manage_workspace', 'invite_users', 'assign_roles'] },
      { name: 'moderator', permissions: ['moderate_content'] },
      { name: 'manager', permissions: ['manage_team'] },
      { name: 'user', permissions: [] },
    ];
  }
  next();
});

workspaceSchema.pre('findOneAndDelete', async function (next) {
  const workspaceId = this.getQuery()['_id'];
  await Membership.deleteMany({ workspace: workspaceId });
  next();
});


const Workspace: Model<IWorkspace> = mongoose.model<IWorkspace>('Workspace', workspaceSchema);
export default Workspace;
