import express from "express";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import {
  createCoupon,
  getAllCoupon,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controllers";

const router = express.Router();

router
  .route("/")
  .get(auth, isAdmin, getAllCoupon)
  .post(auth, isAdmin, createCoupon);

router
  .route("/:id")
  .get(auth, getSingleCoupon)
  .patch(auth, isAdmin, updateCoupon)
  .delete(auth, isAdmin, deleteCoupon);

export default router;
