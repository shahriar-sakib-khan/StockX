import { Schema, model, Document, Types } from 'mongoose';

import {
  InvoiceStatus,
  InvoiceStatusType,
  ProductType,
  SaleChannel,
  SaleChannelType,
} from './invoice.constants.js';

// ---------------------------------------------------------
// Interfaces
// ---------------------------------------------------------

interface IProductSold {
  productType: string;
  productId: Types.ObjectId;
  name: string;
  size?: number;
  regulatorType?: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface IEmptiesReturned {
  productId: Types.ObjectId;
  name: string;
  size?: number;
  regulatorType?: number;
  quantity: number;
}

interface IRepayment {
  date: Date;
  amount: number;
  collectedBy: Types.ObjectId;
  transactionId: Types.ObjectId;
}

export interface IInvoice extends Document {
  store: Types.ObjectId;
  invoiceNo: string;

  // --- Classification ---
  channel: SaleChannelType;

  // Context
  shop?: Types.ObjectId;
  vehicle?: Types.ObjectId;
  customerName?: string;
  customerPhone?: string;
  productsSold: IProductSold[];
  emptiesReturned: IEmptiesReturned[];

  totalAmount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  dueAmount: number;

  repayments: IRepayment[];
  status: InvoiceStatusType;

  issuedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------
// Schema
// ---------------------------------------------------------

const soldItemSchema = new Schema<IProductSold>(
  {
    productType: { type: String, enum: ProductType, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },

    size: { type: Number },
    regulatorType: { type: Number },

    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const returnedItemSchema = new Schema<IEmptiesReturned>(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    size: { type: Number },
    regulatorType: { type: Number },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const repaymentSchema = new Schema<IRepayment>(
  {
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    collectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    invoiceNo: { type: String, required: true, unique: true },

    channel: { type: String, enum: SaleChannel, required: true, index: true },

    shop: { type: Schema.Types.ObjectId, ref: 'Shop', index: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    customerName: { type: String },
    customerPhone: { type: String },

    productsSold: [soldItemSchema],
    emptiesReturned: [returnedItemSchema],

    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, required: true },

    repayments: [repaymentSchema],
    status: { type: String, enum: InvoiceStatus, default: 'due', index: true },

    issuedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false }
);

const Invoice = model<IInvoice>('Invoice', invoiceSchema);
export default Invoice;
