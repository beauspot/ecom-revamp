import { Document } from "mongoose";

export interface IColor extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
