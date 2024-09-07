import mongoose, { Schema } from "mongoose";
import { CartModelInterface } from "@/interfaces/cartModel_Interface";

const cartSchema = new Schema<CartModelInterface>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "ProductModel",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
export const UserCartModel = mongoose.model<CartModelInterface>("CartModel", cartSchema);
