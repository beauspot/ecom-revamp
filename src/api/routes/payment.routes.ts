import express from "express";
import { PaymentController } from "@/controllers/paymentCtrls";
import { auth } from "@/middlewares/authMiddleware";

// const paymentCtrl = new PaymentController();

const paymentRouter = express.Router();

paymentRouter.use(auth);

paymentRouter.post("/createpayment", PaymentController.startPayment);
paymentRouter.get("/createpayment", PaymentController.createPayment);
paymentRouter.get("/paymentdetails", PaymentController.getPayment);
paymentRouter.post(
  "/paystack/createpayment",
  PaymentController.startPaystackPayment
);
paymentRouter.get(
  "/paystack/verifypayment",
  PaymentController.verifyPaystackPayment
);

export default paymentRouter;
