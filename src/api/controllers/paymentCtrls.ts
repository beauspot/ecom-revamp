import { Request, Response } from "express";
import { PaymentService } from "@/services/payment.service";
// import Paystack from "paystack-api";
// const paystack = Paystack(process.env.PAYSTACK_SECRET);

/**
 *
 *
 *
 *
 *
 *
 * Only made changes to this file because of errors from typescript
 * and i wasn't sure what you were trying to do
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
const paymentInstance = new PaymentService();

export class PaymentController {
  public static async startPayment(req: Request, res: Response) {
    try {
      const response = await paymentInstance.startPayment(req.body);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  public static async createPayment(req: Request, res: Response) {
    try {
      const ref = req.body.reference;
      const response = await paymentInstance.createPayment(ref);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  public static async getPayment(req: Request, res: Response) {
    try {
      const response = await paymentInstance.paymentReceipt(req.body);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  public static async startPaystackPayment(req: Request, res: Response) {
    try {
      // const transaction = await paystack.transaction.initialize({
      //   amount: req.body.amount,
      //   email: req.body.email,
      //   callback_url: "http://your-website.com/payment/verify",
      // });

      // res.json({ url: transaction.data.authorization_url });
      res.send("done");
    } catch (err) {
      // res.status(500).json({ error: err.message });
      res.status(500).json({ error: " err.message" });
    }
  }

  public static async verifyPaystackPayment(req: Request, res: Response) {
    try {
      // const verification = await paystack.transaction.verify(
      //   req.query.reference
      // );

      // if (verification.data.status === "success") {
      //   res.json({ message: "Payment successful" });
      // } else {
      //   res.status(400).json({ message: "Payment failed" });
      // }
      res.send("done");
    } catch (err) {
      // res.status(500).json({ error: err.message });
      res.status(500).json({ error: " err.message" });
    }
  }
}
