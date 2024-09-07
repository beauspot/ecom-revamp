import { Schema, model } from "mongoose";
import { checkOutInterface } from "@/interfaces/checkout_interface";

const checkoutSchema = new Schema<checkOutInterface>({
  firstName: String,
  lastName: String,
  email: String,
  amount: Number,
  reference: {
    type: String,
    unique: true,
  },
  status: String,
  orderby: {
    ref: "CartModel",
    type: Schema.Types.ObjectId,
  },
});

export const checkoutModel = model<checkOutInterface>(
  "CheckOutModel",
  checkoutSchema
);
