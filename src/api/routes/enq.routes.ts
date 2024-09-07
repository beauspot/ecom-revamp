import { EnquiryController } from "@/controllers/enqCtrl";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import express from "express";

const enqRoute = express.Router();

enqRoute.use(auth, isAdmin);

enqRoute
  .route("/")
  .get(EnquiryController.getAllEnquiries)
  .post(EnquiryController.createEnq);

enqRoute
  .route("/:id")
  .get(EnquiryController.getEnqByID)
  .patch(EnquiryController.updateEnq)
  .delete(EnquiryController.deleteEnqData);

export default enqRoute;
