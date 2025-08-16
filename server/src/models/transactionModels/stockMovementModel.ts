import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStockMovement extends Document {
  workspace: Types.ObjectId;
  division: Types.ObjectId;

  type: 'sale' | 'purchase' | 'adjustment' | 'swap';
  itemId: Schema.Types.ObjectId;
  itemType: String;
  name?: string;
  quantity: number; // +in / -out
  unit: 'L' | 'unit';
  transactionId: Types.ObjectId;
  meta?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

const stockMovementSchema: Schema<IStockMovement> = new Schema(
  {
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    type: { type: String, enum: ['sale', 'purchase', 'adjustment', 'swap'], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true, refPath: 'Cylinder' },
    itemType: { type: String, enum: ['gas', 'cylinder', 'stove'], required: true },
    name: String,
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'unit'], required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

stockMovementSchema.index({ workspace: 1, division: 1, createdAt: -1 });

stockMovementSchema.methods.toJSON = function (): Partial<IStockMovement> {
  const obj = this.toObject();
  delete obj.__v;

  return obj;
};

const StockMovement: Model<IStockMovement> = mongoose.model<IStockMovement>(
  'StockMovement',
  stockMovementSchema
);
export default StockMovement;
