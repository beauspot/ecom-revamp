import {Service, Inject} from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { plainToInstance } from "class-transformer";

import {CouponDTO} from "@/dto/coupon.dto";
import { CouponService } from "@/services/coupon.service";
import { CustomAPIError } from "@/helpers/utils/custom-errors";


@Service()
export class CouponController {

  constructor(@Inject() private couponservice: CouponService) {}

  createCoupon = asyncHandler(
    async (req: Request, res: Response) => {
      const newCoupon = await this.couponservice.createCouponService(req.body);

      const transformedRes = plainToInstance(CouponDTO, newCoupon, {
        excludeExtraneousValues: true
      });

      res.status(StatusCodes.OK).json({ couponData: transformedRes });
    }
  );
  
   getAllCoupon = asyncHandler(
    async (req: Request, res: Response) => {
      const allCoupons = await this.couponservice.getAllCoupons_service();
      if (!allCoupons) {
        throw new CustomAPIError("Cannot get all Coupons", StatusCodes.NOT_FOUND);
      };

      const transformedRes = plainToInstance(CouponDTO, allCoupons, {
        excludeExtraneousValues: true
      });

      res
        .status(StatusCodes.OK)
        .json({ total: allCoupons.length, couponData: transformedRes });
    }
  );
  
   getSingleCoupon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const couponID = await this.couponservice.getSingleCouponService(id);

      const transformedRes = plainToInstance(CouponDTO, couponID, {
        excludeExtraneousValues: true
      });

      res.status(StatusCodes.OK).json({ coupondata: transformedRes });
    }
  );
  
   updateCoupon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updatedCoupon = await this.couponservice.updateCouponService(id, req.body);

      const transformedRes = plainToInstance(CouponDTO, updatedCoupon, {
        excludeExtraneousValues: true
      });

      res.status(StatusCodes.OK).json({ couponData: transformedRes });
    }
  );
  
  deleteCoupon = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const couponID = await this.couponservice.deleteCouponService(id);
      res.status(StatusCodes.OK)
    }
  );
  
};


