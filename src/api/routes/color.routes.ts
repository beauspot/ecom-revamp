import { Router, Request, Response, NextFunction } from "express";

import { ColorDataModel } from "@/models/colorModel";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { ProductColorService } from "@/services/color.service";
import { ProductColorController } from "@/controllers/colorCtrl";

const router = Router();
let colorservice = new ProductColorService(ColorDataModel);
let colorctrl = new ProductColorController(colorservice);

router.use(auth, isAdmin);

router
  .route("/")
  .get((req: Request, res: Response, next: NextFunction) =>
    colorctrl.getAllColors(req, res)
  )
  .post((req: Request, res: Response, next: NextFunction) =>
    colorctrl.createColor(req, res)
  );

router
  .route("/:id")
  .get((req: Request, res: Response, next: NextFunction) =>
    colorctrl.getColorByID(req, res)
  )
  .patch((req: Request, res: Response, next: NextFunction) =>
    colorctrl.updateColor(req, res)
  )
  .delete((req: Request, res: Response, next: NextFunction) =>
    colorctrl.deleteColor(req, res)
  );

export default router;
