import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPost extends Document {
  store: Types.ObjectId;
  storeName: string;
  storeOwnerName?: string;
  phone: string;
  storeImage?: string;

  postType: 'give' | 'take' | 'both';

  offer: Array<{
    brand: string;
    size: number;
    regulatorType: string;
    quantity: number;
  }>;

  take: Array<{
    brand: string;
    size: number;
    regulatorType: string;
    quantity: number;
  }>;

  description?: string;

  likes: string[];
  comments: Array<{
    userId: Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;

  title: string; // auto generated

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    storeName: { type: String, required: true },
    storeOwnerName: { type: String, default: '' },
    phone: { type: String, required: true },
    storeImage: { type: String, default: '' },

    postType: {
      type: String,
      enum: ['give', 'take', 'both'],
      required: true,
    },

    offer: [
      {
        brand: { type: String, required: true },
        size: { type: Number, required: true },
        regulatorType: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    take: [
      {
        brand: { type: String, required: true },
        size: { type: Number, required: true },
        regulatorType: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    title: { type: String, default: '' },
    description: { type: String, default: '' },

    likes: [{ type: String, default: [] }],
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

postSchema.methods.toJSON = function (): Partial<IPost> {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);
export default Post;
