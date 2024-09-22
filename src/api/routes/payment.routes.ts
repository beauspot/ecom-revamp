import { Router, Request, Response, NextFunction } from "express";
import { __PaymentController__ } from "@/controllers/payment.controller";
import { PaymentService } from "@/services/_payment.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { UserOrderModel } from "@/models/orderModel";

const router = Router();
const paymentService = new PaymentService(UserOrderModel);
const paymentCtrl = new __PaymentController__(paymentService);

// router.use(auth);

router
  .route("/paystack/verifypayment")
  .get((req: Request, res: Response, next: NextFunction) =>
    paymentCtrl.__verifyPayment__(req, res)
  );
router
  .route("/verifypaymentwebhook")
  .get(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    paymentCtrl.verifyPaymentWebhook(req, res)
  );

// router.get("/paymentdetails", PaymentController.getPayment);
// router.post("/createpayment", PaymentController.startPayment);
// router.post(
//   "/paystack/createpayment",
//   PaymentController.startPaystackPayment
// );

export default router;
