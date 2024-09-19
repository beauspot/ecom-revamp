import { Router, Request, Response, NextFunction } from "express";

import { BrandModel } from "@/models/brands.models";
import { BrandController } from "@/controllers/brand.controllers";
import { BrandService } from "@/services/brand.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";

const router = Router();
let brandservice = new BrandService(BrandModel);
let brandctrl = new BrandController(brandservice);

router.use(auth, isAdmin);

router
  .route("/productbrands")
  .get((req: Request, res: Response, next: NextFunction) =>
    brandctrl.getAllBrands(req, res, next)
  )
  .post((req: Request, res: Response, next: NextFunction) =>
    brandctrl.createNewBrand(req, res, next)
  );

router
  .route("/productbrands/:id")
  .get((req: Request, res: Response, next: NextFunction) =>
    brandctrl.getSingleBrand(req, res, next)
  )
  .patch((req: Request, res: Response, next: NextFunction) =>
    brandctrl.updateSingleBrand(req, res, next)
  )
  .delete((req: Request, res: Response, next: NextFunction) =>
    brandctrl.delete_brand(req, res, next)
  );

export default router;
