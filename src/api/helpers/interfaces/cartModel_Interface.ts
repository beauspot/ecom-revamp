import { Document, Types } from "mongoose";
import { ProductDataInterface } from "@/interfaces/product_Interface";

export interface CartModelInterface extends Document {
  products: ProductDataInterface["id"];
  cartTotal: number;
  totalAfterDiscount: number;
  orderby: Types.ObjectId;
  remove: () => void;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  count: number;
  color: string;
  price: number;
}
