import  { Document } from "mongoose";

export interface BlogCategoryInterface extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
};