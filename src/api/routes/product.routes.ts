import { Router, Request, Response, NextFunction } from "express";

import { productModel } from "@/models/productsModels";
import { validate } from "@/middlewares/validateResource";
import { ProductService } from "@/services/product.service";
import { createProductSchema } from "@/validators/products.schema";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { ProductController } from "@/controllers/productCtrls";
import { uploadPhoto, productImageResize } from "@/middlewares/uploadImages";

let router = Router();
let productService = new ProductService(productModel);
let productController = new ProductController(productService);

// TODO: setup validation middleware and validate the req.body, .params, & . query

router
  .route("/allproducts")
  .get((req: Request, res: Response, next: NextFunction) =>
    productController.get_all_products(req, res, next)
  );
router
  .route("/:id")
  .get((req: Request, res: Response, next: NextFunction) =>
    productController.getASingleProduct(req, res, next)
  );
router
  .route("/upload/:id")
  .put(
    auth,
    isAdmin,
    uploadPhoto.array("image", 10),
    productImageResize,
    (req: Request, res: Response, next: NextFunction) =>
      productController.uploadImageCtrl(req, res, next)
  );

router
  .route("/rateproduct")
  .put(auth, (req: Request, res: Response, next: NextFunction) =>
    productController.rateProduct(req, res)
  );

router.use(auth, isAdmin);

router
  .route("/createproduct")
  .post(
    validate(createProductSchema),
    (req: Request, res: Response, next: NextFunction) =>
      productController.create_product(req, res, next)
  );
router
  .route("/:id")
  .patch((req: Request, res: Response, next: NextFunction) =>
    productController.updateSingleProduct(req, res, next)
  );
router
  .route("/:id")
  .delete((req: Request, res: Response, next: NextFunction) =>
    productController.deleteProduct(req, res, next)
  );

export default router;
