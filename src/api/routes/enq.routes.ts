import { Router, Request, Response, NextFunction } from "express";

import { EnquiryDataModel } from "@/models/enqModel";
import { EnquiryService } from "@/services/enq.service";
import { EnquiryController } from "@/controllers/enqCtrl";
import { auth, isAdmin } from "@/middlewares/authMiddleware";

const router = Router();
let enquiryService = new EnquiryService(EnquiryDataModel);
let enquiryctrl = new EnquiryController(enquiryService);

router.use(auth, isAdmin);

router
  .route("/")
  .get((req: Request, res: Response, next: NextFunction) =>
    enquiryctrl.getAllEnquiries(req, res, next)
  )
  .post((req: Request, res: Response, next: NextFunction) =>
    enquiryctrl.createEnq(req, res, next)
  );

router.route("/:id")
  .get((req: Request, res: Response, next: NextFunction) =>
  enquiryctrl.getEnqByID(req, res, next))
  .patch((req: Request, res: Response, next: NextFunction) => 
  enquiryctrl.updateEnq(req, res, next))
  .delete((req: Request, res: Response, next: NextFunction) => 
  enquiryctrl.deleteEnqData(req, res, next));

export default router;