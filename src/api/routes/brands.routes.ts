import { Router, Request, Response, NextFunction } from "express";

import { BrandModel } from "@/models/brands.models";
import { validate } from "@/middlewares/validateResource";
import { BrandService } from "@/services/brand.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { BrandController } from "@/controllers/brand.controllers";
import {
  brandsSchema,
  updateBrandSchema,
  getSingleBrandsSchema,
  deleteBrandsSchema,
} from "@/validators/brand.schema";

const router = Router();
let brandservice = new BrandService(BrandModel);
let brandctrl = new BrandController(brandservice);

router.use(auth, isAdmin);

router
  .route("/productbrands")
  .get((req: Request, res: Response, next: NextFunction) =>
    brandctrl.getAllBrands(req, res, next)
  )
  .post(
    validate(brandsSchema),
    (req: Request, res: Response, next: NextFunction) =>
      brandctrl.createNewBrand(req, res, next)
  );

router
  .route("/productbrands/:id")
  .get(
    validate(getSingleBrandsSchema),
    (req: Request, res: Response, next: NextFunction) =>
      brandctrl.getSingleBrand(req, res, next)
  )
  .patch(
    validate(updateBrandSchema),
    (req: Request, res: Response, next: NextFunction) =>
      brandctrl.updateSingleBrand(req, res, next)
  )
  .delete(
    validate(deleteBrandsSchema),
    (req: Request, res: Response, next: NextFunction) =>
      brandctrl.delete_brand(req, res, next)
  );

export default router;
