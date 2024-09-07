import express from "express";
import {
createNewBrand,
getAllBrands,
getSingleBrand,
updateSingleBrand,
 delete_brand,
} from "@/controllers/brand.controllers";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
const router = express.Router();

router
  .route("/productbrands")
  .get(auth, isAdmin, getAllBrands)
  .post(auth, isAdmin, createNewBrand);

router
  .route("/productbrands/:id")
  .get(auth, isAdmin, getSingleBrand)
  .patch(auth, isAdmin, updateSingleBrand)
  .delete(auth, isAdmin, delete_brand);

export default router;
