import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDivisionMembership extends Document {
  user: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  division: mongoose.Types.ObjectId;
  divisionRoles: string[];
  status: 'active' | 'invited' | 'removed';
  invitedBy?: mongoose.Types.ObjectId | null;
  removedBy?: mongoose.Types.ObjectId | null;
}

const divisionMembershipSchema: Schema<IDivisionMembership> = new Schema(
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
    division: {
      type: Schema.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
    divisionRoles: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'invited'],
      default: 'active',
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

divisionMembershipSchema.pre('save', function (next) {
  this.divisionRoles = [...new Set(this.divisionRoles)]; // deduplicate roles
  next();
});

const DivisionMembership: Model<IDivisionMembership> = mongoose.model<IDivisionMembership>(
  'DivisionMembership',
  divisionMembershipSchema
);
export default DivisionMembership;
