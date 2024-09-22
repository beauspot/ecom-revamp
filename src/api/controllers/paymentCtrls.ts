import { Service, Inject } from "typedi";
import { Request, Response } from "express";
import { PaymentService } from "@/services/payment.service";
// import Paystack from "paystack-api";
// const paystack = Paystack(process.env.PAYSTACK_SECRET);

@Service()
export class PaymentController {
  constructor(@Inject() private paymentservice: PaymentService) {}

  async startPayment(req: Request, res: Response) {
    try {
      const response = await this.paymentservice.startPayment(req.body);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const ref = req.body.reference;
      const response = await this.paymentservice.createPayment(ref);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  async getPayment(req: Request, res: Response) {
    try {
      const response = await this.paymentservice.paymentReceipt(req.body);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  async startPaystackPayment(req: Request, res: Response) {
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

  async verifyPaystackPayment(req: Request, res: Response) {
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
