import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICylinder extends Document {
  name?: string;
  sku: string;
  brand: string;
  regulatorType: string;
  size: number;
  unit: string;
  workspace: mongoose.Types.ObjectId;
  division: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
}

const itemSchema: Schema<ICylinder> = new Schema(
  {
    name: { type: String, trim: true },
    sku: { type: String, unique: true, trim: true },
    brand: { type: String, required: true },
    regulatorType: { type: String, required: true, default: '22' },
    size: { type: Number, required: true, default: 12 },
    unit: { type: String, required: true, default: 'L' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// SKU Generator (custom logic)
function generateSKU({
  brand,
  size,
  unit,
  regulatorType,
}: {
  brand?: string;
  size?: number;
  unit?: string;
  regulatorType?: string;
}): string {
  const brandCode = brand?.substring(0, 3).toUpperCase() || 'GEN';
  const sizeUnit = size && unit ? `${size}${unit[0].toUpperCase()}` : '12L';
  const regulatorTypeCode = regulatorType?.replace(/\D/g, '').substring(0, 2).toUpperCase() || '22';
  return `${brandCode}-${regulatorTypeCode}-${sizeUnit}`;
}

itemSchema.pre<ICylinder>('save', async function (next) {
  if (!this.sku && this.brand && this.size && this.unit) {
    let baseSku = generateSKU({
      brand: this.brand,
      size: this.size,
      unit: this.unit,
      regulatorType: this.regulatorType,
    });

    // Generate unique Stock Keeping Unit
    let sku = baseSku;
    let suffix = 1;
    while (await mongoose.models.Item.exists({ sku })) {
      sku = `${baseSku}-${suffix++}`;
    }
    this.sku = sku;
  }
  next();
});

itemSchema.methods.toJSON = function (): Partial<ICylinder> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Item: Model<ICylinder> = mongoose.model<ICylinder>('Item', itemSchema);
export default Item;
