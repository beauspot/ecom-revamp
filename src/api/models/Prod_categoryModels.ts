import mongoose, { Schema } from "mongoose";
import { ProductCategoryInterface } from "@/interfaces/prod_category_interface";

const productCategorySchema: Schema<ProductCategoryInterface> = new Schema(
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

const ProductCategoryModel = mongoose.model<ProductCategoryInterface>(
  "ProductsCategoryModel",
  productCategorySchema
);

export default ProductCategoryModel;
