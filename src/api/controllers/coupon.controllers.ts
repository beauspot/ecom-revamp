import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "@/helpers/utils/custom-errors";
import {
  createCouponService,
  getAllCoupons_service,
  getSingleCouponService,
  updateCouponService,
  deleteCouponService,
} from "@/services/coupon.service";

export const createCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const newCoupon = await createCouponService(req.body);
    res.status(StatusCodes.OK).json({ couponData: newCoupon });
  }
);

export const getAllCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const allCoupons = await getAllCoupons_service();
    if (!allCoupons) {
      throw new CustomAPIError("Cannot get all Coupons", StatusCodes.NOT_FOUND);
    }
    res
      .status(StatusCodes.OK)
      .json({ total: allCoupons.length, couponData: allCoupons });
  }
);

export const getSingleCoupon = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const couponID = await getSingleCouponService(id);
    res.status(StatusCodes.OK).json({ coupondata: couponID });
  }
);

export const updateCoupon = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updatedCoupon = await updateCouponService(id, req.body);
    res.status(StatusCodes.OK).json({ couponData: updatedCoupon });
  }
);

export const deleteCoupon = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const couponID = await deleteCouponService(id);
    res.status(StatusCodes.OK).json({
      status: "Deleted Coupon Successfully",
      BlogData: couponID,
    });
  }
);
