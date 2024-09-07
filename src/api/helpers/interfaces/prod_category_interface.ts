import  { Document } from "mongoose";

export interface ProductCategoryInterface extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
};