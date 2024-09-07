import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";
import { verifyPayment } from "@/helpers/utils/paystack.utils";
import { createHmac } from "crypto";
import { PaymentService } from "@/services/_payment.service";

export default class PaymentController {
  public static async initializeOrder(
    req: AuthenticatedRequest,
    res: Response
  ) {}

  public static async verifyPayment(req: AuthenticatedRequest, res: Response) {
    const reference = req.params.reference;

    const resp = PaymentService.verify(reference);

    res.send(resp);
  }

  public static async verifyPaymentWebhook(req: Request, res: Response) {
    const secret = process.env.PAY_STACK_API_KEY as string;
    const hash = createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      const event = req.body;

      /**
       * 
       * This is a sample of what event looks like
       * Check [https://paystack.com/docs/payments/webhooks/#supported-events] for more information
       * 
       * {
            "event": "charge.success",
            "data": {
              "id": 302961,
              "domain": "live",
              "status": "success",
              "reference": "qTPrJoy9Bx",
              "amount": 10000,
              "message": null,
              "gateway_response": "Approved by Financial Institution",
              "paid_at": "2016-09-30T21:10:19.000Z",
              "created_at": "2016-09-30T21:09:56.000Z",
              "channel": "card",
              "currency": "NGN",
              "ip_address": "41.242.49.37",
              "metadata": 0,
              "log": {
                "time_spent": 16,
                "attempts": 1,
                "authentication": "pin",
                "errors": 0,
                "success": false,
                "mobile": false,
                "input": [],
                "channel": null,
                "history": [
                  {
                    "type": "input",
                    "message": "Filled these fields: card number, card expiry, card cvv",
                    "time": 15
                  },
                  {
                    "type": "action",
                    "message": "Attempted to pay",
                    "time": 15
                  },
                  {
                    "type": "auth",
                    "message": "Authentication Required: pin",
                    "time": 16
                  }
                ]
              },
              "fees": null,
              "customer": {
                "id": 68324,
                "first_name": "BoJack",
                "last_name": "Horseman",
                "email": "bojack@horseman.com",
                "customer_code": "CUS_qo38as2hpsgk2r0",
                "phone": null,
                "metadata": null,
                "risk_action": "default"
              },
              "authorization": {
                "authorization_code": "AUTH_f5rnfq9p",
                "bin": "539999",
                "last4": "8877",
                "exp_month": "08",
                "exp_year": "2020",
                "card_type": "mastercard DEBIT",
                "bank": "Guaranty Trust Bank",
                "country_code": "NG",
                "brand": "mastercard",
                "account_name": "BoJack Horseman"
              },
              "plan": {}
            }
          }
       */

      /**\
       * This can be handled in two ways
       * 1. Pick the refernce from data (event.data.reference) and use same function [ PaymentService.verify(reference) ] that is
       * being used in the verifyPayment method of this class.
       *
       * 2. Use the info from the event to verify the payment.
       *    Once we are sure this info is coming from paystack.
       *    We can pick the orderId from the meta data.
       *    Retrieve the order from the database
       *    Check that the amount paid is equal to the total cost of the order
       *    Update the order with the necessary information if everything checks out
       *
       */
    }
    res.send(200);
  }
}
