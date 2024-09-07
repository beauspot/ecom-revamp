import { StatusCodes } from "http-status-codes";
import { CouponModel } from "@/models/coupon.models";
import CustomAPIError from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { CouponInterface } from "@/interfaces/coupon_interface";

export const createCouponService = async (coupon: CouponInterface) => {
  const newCoupon = await CouponModel.create({ ...coupon });
  if (!newCoupon)
    throw new CustomAPIError(
      "Your Post was not created Successfully.",
      StatusCodes.BAD_REQUEST
    );
  return newCoupon;
};

export const getAllCoupons_service = async (): Promise<CouponInterface[]> => {
  const allCoupons = await CouponModel.find();
  if (allCoupons.length <= 0) {
    throw new CustomAPIError(`No coupon found`, StatusCodes.NO_CONTENT);
  }
  return allCoupons;
};

export const getSingleCouponService = async (couponID: string) => {
  const couponExists = await CouponModel.findById(couponID);
    validateMongoDbID(couponID);
  if (!couponExists) {
    throw new CustomAPIError(
      `Cannot find coupon the the ID: ${couponID}`,
      StatusCodes.NOT_FOUND
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
    throw new CustomAPIError(
      `The Coupon with the id: ${couponID} was not found to be updated`,
      StatusCodes.NOT_FOUND
    );
  return updateCoupon;
};

export const deleteCouponService = async (couponID: string) => {
  const coupon = await CouponModel.findOneAndDelete({ _id: couponID });
  validateMongoDbID(couponID);
  if (!coupon)
    throw new CustomAPIError(
      `the coupon with ID ${couponID} is not available`,
      StatusCodes.BAD_REQUEST
    );
};
