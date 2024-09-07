import mongoose, { Schema } from "mongoose";
import { BrandInterface } from "@/interfaces/brand.interface";

const brandSchema: Schema<BrandInterface> = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BrandModel = mongoose.model<BrandInterface>("Brand", brandSchema);
