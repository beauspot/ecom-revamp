import { CouponInterface } from "@/interfaces/coupon_interface";
import { Schema, Model, model } from "mongoose";

const couponSchema = new Schema<CouponInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

// Define the model
export const CouponModel: Model<CouponInterface> = model<CouponInterface>(
  "Coupon",
  couponSchema
);

