import { Exclude, Expose } from "class-transformer";

export class CouponDTO {
  @Expose()
  name: string;

  @Expose()
  expiry: Date;

  @Expose()
  dicsount: number;

  @Exclude()
  _id: string;

  @Exclude()
  __v: number;
}
