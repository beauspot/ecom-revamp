import {Service, Inject} from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

import { CouponService } from "@/services/coupon.service";
import { CustomAPIError } from "@/helpers/utils/custom-errors";


@Service()
export class CouponController {

  constructor(@Inject() private couponservice: CouponService) {}

  createCoupon = asyncHandler(
    async (req: Request, res: Response) => {
      const newCoupon = await this.couponservice.createCouponService(req.body);
      res.status(StatusCodes.OK).json({ couponData: newCoupon });
    }
  );
  
   getAllCoupon = asyncHandler(
    async (req: Request, res: Response) => {
      const allCoupons = await this.couponservice.getAllCoupons_service();
      if (!allCoupons) {
        throw new CustomAPIError("Cannot get all Coupons", StatusCodes.NOT_FOUND);
      }
      res
        .status(StatusCodes.OK)
        .json({ total: allCoupons.length, couponData: allCoupons });
    }
  );
  
   getSingleCoupon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const couponID = await this.couponservice.getSingleCouponService(id);
      res.status(StatusCodes.OK).json({ coupondata: couponID });
    }
  );
  
   updateCoupon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updatedCoupon = await this.couponservice.updateCouponService(id, req.body);
      res.status(StatusCodes.OK).json({ couponData: updatedCoupon });
    }
  );
  
  deleteCoupon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const couponID = await this.couponservice.deleteCouponService(id);
      res.status(StatusCodes.OK).json({
        status: "Deleted Coupon Successfully",
        coupondata: couponID,
      });
    }
  );
  
};


