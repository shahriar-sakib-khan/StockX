import mongoose from "mongoose";
const { Schema } = mongoose;

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      unique: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional
    description: {
      type: String,
      default: "",
    },

    // Future Proofing: store custom workspace roles created by admin
    customRoles: [
      {
        name: { type: String },
        permissions: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Workspace", workspaceSchema);
