import { Document } from "mongoose";

export interface BrandInterface extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
