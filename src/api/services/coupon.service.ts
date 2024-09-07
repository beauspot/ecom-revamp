import { StatusCodes } from "http-status-codes";
import { CouponModel } from "@/models/coupon.models";
import {ServiceAPIError}  from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { CouponInterface } from "@/interfaces/coupon_interface";

export const createCouponService = async (coupon: CouponInterface) => {
  const newCoupon = await CouponModel.create({ ...coupon });
  if (!newCoupon)
    throw new ServiceAPIError (
      "Your Post was not created Successfully."
    );
  return newCoupon;
};

export const getAllCoupons_service = async (): Promise<CouponInterface[]> => {
  const allCoupons = await CouponModel.find();
  if (allCoupons.length <= 0) {
    throw new ServiceAPIError (`No coupon found`);
  }
  return allCoupons;
};

export const getSingleCouponService = async (couponID: string) => {
  const couponExists = await CouponModel.findById(couponID);
    validateMongoDbID(couponID);
  if (!couponExists) {
    throw new ServiceAPIError (
      `Cannot find coupon the the ID: ${couponID}`
    );
  }
  return couponExists;
};

export const updateCouponService = async (
  couponID: string,
  updatedData: Partial<CouponInterface>
) => {
  validateMongoDbID(couponID);
  const updateCoupon = await CouponModel.findByIdAndUpdate(
    { _id: couponID },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateCoupon)
    throw new ServiceAPIError (
      `The Coupon with the id: ${couponID} was not found to be updated`
    );
  return updateCoupon;
};

export const deleteCouponService = async (couponID: string) => {
  const coupon = await CouponModel.findOneAndDelete({ _id: couponID });
  validateMongoDbID(couponID);
  if (!coupon)
    throw new ServiceAPIError (
      `the coupon with ID ${couponID} is not available`
    );
};
