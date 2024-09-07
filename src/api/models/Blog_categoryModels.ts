import mongoose, { Schema } from "mongoose";
import { BlogCategoryInterface } from "@/interfaces/blog_category_interface ";

const blogCategorySchema: Schema<BlogCategoryInterface> = new Schema(
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

const BlogCategoryModel = mongoose.model<BlogCategoryInterface>(
  "BlogCategoryModel",
  blogCategorySchema
);

export default BlogCategoryModel;
