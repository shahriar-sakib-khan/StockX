import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStockMovement extends Document {
  workspaceId: Types.ObjectId;
  divisionId: Types.ObjectId;

  type: 'sale' | 'purchase' | 'adjustment' | 'swap';
  itemType: 'gas' | 'cylinder' | 'stove';
  brand?: string;
  quantity: number; // +in / -out
  unit: 'L' | 'unit';
  transactionId?: Types.ObjectId; // link to Transaction
  meta?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

const stockMovementSchema: Schema<IStockMovement> = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    divisionId: { type: Schema.Types.ObjectId, ref: 'Division', required: true, index: true },
    type: { type: String, enum: ['sale', 'purchase', 'adjustment', 'swap'], required: true },
    itemType: { type: String, enum: ['gas', 'cylinder', 'stove'], required: true },
    brand: String,
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'unit'], required: true },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

stockMovementSchema.index({ workspaceId: 1, divisionId: 1, createdAt: -1 });

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
