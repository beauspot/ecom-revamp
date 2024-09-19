import { Service, Inject } from "typedi";

import { CouponModel } from "@/models/coupon.models";
import { ServiceAPIError } from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { CouponInterface } from "@/interfaces/coupon_interface";

@Service()
export class CouponService {
  constructor(@Inject(() => CouponModel) private coupon: typeof CouponModel) {}

  createCouponService = async (coupon: CouponInterface) => {
    const newCoupon = await this.coupon.create({ ...coupon });
    if (!newCoupon)
      throw new ServiceAPIError("Your Post was not created Successfully.");
    return newCoupon;
  };

  getAllCoupons_service = async (): Promise<CouponInterface[]> => {
    const allCoupons = await this.coupon.find();
    if (allCoupons.length <= 0) {
      throw new ServiceAPIError(`No coupon found`);
    }
    return allCoupons;
  };

  getSingleCouponService = async (couponID: string) => {
    const couponExists = await this.coupon.findById(couponID);
    validateMongoDbID(couponID);
    if (!couponExists) {
      throw new ServiceAPIError(`Cannot find coupon the the ID: ${couponID}`);
    }
    return couponExists;
  };

  updateCouponService = async (
    couponID: string,
    updatedData: Partial<CouponInterface>
  ) => {
    validateMongoDbID(couponID);
    const updateCoupon = await this.coupon.findByIdAndUpdate(
      { _id: couponID },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateCoupon)
      throw new ServiceAPIError(
        `The Coupon with the id: ${couponID} was not found to be updated`
      );
    return updateCoupon;
  };

  deleteCouponService = async (couponID: string) => {
    const coupon = await this.coupon.findOneAndDelete({ _id: couponID });
    validateMongoDbID(couponID);
    if (!coupon)
      throw new ServiceAPIError(
        `the coupon with ID ${couponID} is not available`
      );
  };
}
