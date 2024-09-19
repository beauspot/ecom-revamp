import { Router, Request, Response, NextFunction } from "express";

import { CouponModel } from "@/models/coupon.models";
import { CouponService } from "@/services/coupon.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { CouponController } from "../controllers/coupon.controllers";

const router = Router();
let couponservice = new CouponService(CouponModel);
let couponctrl = new CouponController(couponservice);

router
  .route("/")
  .get(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    couponctrl.getAllCoupon(req, res, next)
  )
  .post(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    couponctrl.createCoupon(req, res, next)
  );

router
  .route("/:id")
  .get(auth, (req: Request, res: Response, next: NextFunction) =>
    couponctrl.getSingleCoupon(req, res, next)
  )
  .patch(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    couponctrl.updateCoupon(req, res, next)
  )
  .delete(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    couponctrl.deleteCoupon(req, res, next)
  );

export default router;