import mongoose, { Schema } from "mongoose";
import { OrderInterface } from "@/interfaces/order_interface";

const orderSchema = new Schema<OrderInterface>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "ProductModel",
        },
        // TODO:
        // if count is quantity, you should rename this to quantity
        count: Number,
        color: String,
        price: Number,
      },
    ],
    paymentIntent: {},
    paymentType: {
      type: String,
      default: "Web",
      enum: ["Web", "Cash on Delivery"],
    },
    PaymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Failed", "Successful"],
    },
    paymentReference: {
      type: String,
    },
    paymentProcessor: {
      type: String,
      enum: ["Paystack", "Cash"],
    },
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    orderby: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
    },
  },
  {
    timestamps: true,
  }
);

export const UserOrderModel = mongoose.model<OrderInterface>(
  "OrderModel",
  orderSchema
);
