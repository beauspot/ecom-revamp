import { Router, Request, Response, NextFunction } from "express";

import { CouponModel } from "@/models/coupon.models";
import { CouponService } from "@/services/coupon.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { validate } from "@/middlewares/validateResource";
import { CouponController } from "../controllers/coupon.controllers";
import {
  createCouponSchema,
  updateCouponSchema,
  getSingleCoupon,
  deleteSingleCoupon,
} from "@/validators/coupon.schema";

const router = Router();
let couponservice = new CouponService(CouponModel);
let couponctrl = new CouponController(couponservice);

router
  .route("/")
  .get(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    couponctrl.getAllCoupon(req, res, next)
  )
  .post(
    auth,
    isAdmin,
    validate(createCouponSchema),
    (req: Request, res: Response, next: NextFunction) =>
      couponctrl.createCoupon(req, res, next)
  );

router
  .route("/:id")
  .get(
    auth,
    validate(getSingleCoupon),
    (req: Request, res: Response, next: NextFunction) =>
      couponctrl.getSingleCoupon(req, res, next)
  )
  .patch(
    auth,
    isAdmin,
    validate(updateCouponSchema),
    (req: Request, res: Response, next: NextFunction) =>
      couponctrl.updateCoupon(req, res, next)
  )
  .delete(
    auth,
    isAdmin,
    validate(deleteSingleCoupon),
    (req: Request, res: Response, next: NextFunction) =>
      couponctrl.deleteCoupon(req, res, next)
  );

export default router;
