import { Schema, model } from "mongoose";
import { ProductDataInterface } from "@/interfaces/product_Interface";

const productSchema = new Schema<ProductDataInterface>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
    select: false,
  },
  quantity: {
    type: Number,
    required: true,
    select: false,
  },
  images: {
    type: [String],
  },
  color: {
    type: String,
    required: true,
  },
  ratings: [
    {
      star: Number,
      comment: String,
      postedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
    },
    { timestamps: true },
  ],
  totalrating: {
    type: Number,
    default: 0,
  },
});

export const productModel = model<ProductDataInterface>(
  "ProductModel",
  productSchema
);
