import mongoose, { Schema } from "mongoose";
import { IColor } from "@/interfaces/colorInterface";

const colorSchema = new Schema<IColor>(
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

export const ColorDataModel = mongoose.model<IColor>("ColorModel", colorSchema);