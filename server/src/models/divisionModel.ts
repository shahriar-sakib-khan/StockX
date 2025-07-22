import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDivision extends Document {
  name: string;
  description?: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  defaultRoles: { name: string; permissions: string[] }[];
  customRoles: { name: string; permissions: string[] }[];
}

const divisionSchema: Schema<IDivision> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Division name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    defaultRoles: [
      {
        name: { type: String, required: true },
        permissions: [{ type: String }],
      },
    ],
    customRoles: [
      {
        name: { type: String, required: true },
        permissions: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

divisionSchema.pre('save', function (next) {
  if (!this.defaultRoles || this.defaultRoles.length === 0) {
    this.defaultRoles = [
      { name: 'division_admin', permissions: ['manage_division', 'assign_roles'] },
      { name: 'division_member', permissions: [] },
    ];
  }
  next();
});

const Division: Model<IDivision> = mongoose.model<IDivision>('Division', divisionSchema);
export default Division;
