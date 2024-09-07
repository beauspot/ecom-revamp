import { Document, Types } from "mongoose";
import { ProductDataInterface } from "../interfaces/product_Interface";

export interface OrderInterface extends Document {
  products: {
    product: ProductDataInterface;
    count: number;
    color: string;
    price: number;
  }[];
  paymentIntent: any;
  paymentType: "Web" | "Cash on Delivery";
  PaymentStatus: "Pending" | "Failed" | "Successful";
  paymentReference: string;
  paymentProcessor: "Paystack" | "Cash";
  orderStatus:
    | "Not Processed"
    | "Cash on Delivery"
    | "Processing"
    | "Dispatched"
    | "Cancelled"
    | "Delivered";
  orderby: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateOrderStatusParams {
  id: string;
  status: string;
}

export interface CreateOrderParams {
  products: { product: string; count: number; color: string }[];
  paymentType: string;
  paymentProcessor: string;
  orderby: string;
}
