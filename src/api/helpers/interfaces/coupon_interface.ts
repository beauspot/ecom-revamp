import {Document} from "mongoose";

export interface CouponInterface extends Document {
  name: string;
  expiry: Date;
  discount: number;
}