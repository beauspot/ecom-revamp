import { Router, Request, Response, NextFunction } from "express";

import { auth, isAdmin } from "@/middlewares/authMiddleware";
import ProductCategoryModel from "@/models/Prod_categoryModels";
import { ProductCategoryService } from "@/services/ProdCat.service";
import { ProductCategoryCtrl } from "@/controllers/prod_category.controllers";

let router = Router();
let product_cat_service = new ProductCategoryService(ProductCategoryModel);
let product_cat_ctrl = new ProductCategoryCtrl(product_cat_service);

router.use(auth, isAdmin);

router
  .route("/category")
  .get((req: Request, res: Response, next: NextFunction) =>
    product_cat_ctrl.getAllCategory(req, res, next)
  )
  .post((req: Request, res: Response, next: NextFunction) =>
    product_cat_ctrl.createNewCategory(req, res, next)
  );

router
  .route("/category/:id")
  .get((req: Request, res: Response, next: NextFunction) =>
    product_cat_ctrl.getSingleCategory(req, res, next)
  )
  .patch((req: Request, res: Response, next: NextFunction) =>
    product_cat_ctrl.updateSingleCategory(req, res, next)
  )
  .delete((req: Request, res: Response, next: NextFunction) =>
    product_cat_ctrl.delete_category(req, res, next)
  );

export default router;
