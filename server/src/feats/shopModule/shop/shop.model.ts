import { Schema, model, Document, Types } from 'mongoose';

export interface IShop extends Document {
  store: Types.ObjectId;
  shopName: string;
  ownerName?: string;
  phoneNumber?: string;
  location: string;
  image?: string;

  // Financial Stats
  totalDue: number;
  totalPurchases: number;
  totalPayments: number;
  totalDeliveries: number;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, trim: true },

    totalDue: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    totalPayments: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Shop = model<IShop>('Shop', shopSchema);
export default Shop;
