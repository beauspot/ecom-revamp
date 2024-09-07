import express from "express";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import {
  create_product,
  updateSingleProduct,
  deleteProduct,
  get_all_products,
  getASingleProduct,
  rateProduct,
  uploadImageCtrl,
} from "@/controllers/productCtrls";

import { uploadPhoto, productImageResize } from "@/middlewares/uploadImages";

const productRoute = express.Router();

productRoute.get("/allproducts", get_all_products);
productRoute.get("/:id", getASingleProduct);
productRoute.put(
  "/upload/:id",
  auth,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadImageCtrl
);
productRoute.put("/rateproduct", auth, rateProduct);

productRoute.use(auth, isAdmin);

productRoute.post("/createproduct", create_product);
productRoute.patch("/:id", updateSingleProduct);
productRoute.delete("/:id", deleteProduct);

export default productRoute;
