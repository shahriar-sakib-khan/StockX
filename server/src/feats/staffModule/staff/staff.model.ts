import { Schema, model, Document, Types } from 'mongoose';

export interface IStaff extends Document {
  store: Types.ObjectId;

  // Identity (Auth)
  username: string;
  password?: string; // Select: false by default
  isActive: boolean;

  // Profile (User)
  name: string;
  phone: string;
  role: string; // 'manager', 'cashier', etc.
  image?: string;
  address?: string;

  // Ledger (Salary Data)
  payroll: {
    baseSalary: number;
    currentDue: number;
    totalPaid: number;
    lastPaymentDate?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },

    // Identity
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },

    // Profile
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, required: true, default: 'staff' },
    image: { type: String, trim: true },
    address: { type: String, trim: true },

    // Ledger
    payroll: {
      baseSalary: { type: Number, default: 0, min: 0 },
      currentDue: { type: Number, default: 0 },
      totalPaid: { type: Number, default: 0 },
      lastPaymentDate: { type: Date },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique username per store
staffSchema.index({ store: 1, username: 1 }, { unique: true });

const Staff = model<IStaff>('Staff', staffSchema);
export default Staff;
