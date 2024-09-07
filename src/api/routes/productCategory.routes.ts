import express from "express";
import {
  createNewCategory,
  getAllCategory,
  getSingleCategory,
  updateSingleCategory,
  delete_category,
} from "@/controllers/prod_category.controllers";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
const router = express.Router();

router
  .route("/category")
  .get(auth, isAdmin, getAllCategory)
  .post(auth, isAdmin, createNewCategory);

router
  .route("/category/:id")
  .get(auth, isAdmin, getSingleCategory)
  .patch(auth, isAdmin, updateSingleCategory)
  .delete(auth, isAdmin, delete_category);

export default router;
