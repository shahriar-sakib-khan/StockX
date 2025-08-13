import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDivision extends Document {
  name: string;
  description?: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  divisionRoles: { name: string; permissions: string[]; _id?: mongoose.Types.ObjectId }[];
}

const divisionSchema: Schema<IDivision> = new Schema(
  {
    name: { type: String, required: [true, 'Division name is required'], trim: true },
    description: { type: String, default: '' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    divisionRoles: [{ name: { type: String, required: true }, permissions: [{ type: String }] }],
  },
  { timestamps: true }
);

divisionSchema.pre('save', function (next) {
  if (!this.divisionRoles || this.divisionRoles.length === 0) {
    this.divisionRoles = [
      { name: 'division_admin', permissions: ['manage_division', 'assign_roles'] },
      { name: 'division_member', permissions: [] },
    ];
  }
  next();
});

divisionSchema.methods.toJSON = function (): Partial<IDivision> {
  const obj = this.toObject();
  delete obj.__v;

  return obj as Partial<IDivision>;
};

const Division: Model<IDivision> = mongoose.model<IDivision>('Division', divisionSchema);
export default Division;
