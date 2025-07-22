import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDivisionMembership extends Document {
  user: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  division: mongoose.Types.ObjectId;
  divisionRoles: string[];
  status: 'active' | 'invited';
  invitedBy: mongoose.Types.ObjectId;
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
    divisionRoles: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'invited'],
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

// Prevent duplicates within same division
divisionMembershipSchema.index({ user: 1, division: 1 }, { unique: true });

divisionMembershipSchema.pre('save', function (next) {
  this.divisionRoles = [...new Set(this.divisionRoles)];
  next();
});

const DivisionMembership: Model<IDivisionMembership> = mongoose.model<IDivisionMembership>(
  'DivisionMembership',
  divisionMembershipSchema
);
export default DivisionMembership;
