import { UserOrderModel } from "@/models/orderModel";
import axios from "axios";

export class PaymentService {
  public static async verify(reference: string) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            authorization: `Bearer ${process.env.PAY_STACK_API_KEY}`,
            "content-type": "application/json",
            "cache-control": "no-cache",
          },
        }
      );

      if (response.status !== 200) throw new Error(response.data.message);

      if (response.data.status !== true)
        throw new Error("Verification unsuccessful");

      const orderId = response.data.data.metadata.custom_fields[0].orderId;

      const order = await UserOrderModel.findById(orderId);

      if (!order)
        throw new Error(`order for payment reference "${reference}" not found`);

      const totalCost: number = order.products.reduce(
        (total, current) => total + current.price * current.count,
        0
      );

      if (response.data.data.amount !== totalCost) {
        //  TODO: handle amount paid !== to cost of order
        // store this information somwehere and contact the ueser
      } else {
        UserOrderModel.findByIdAndUpdate(order._id, {
          paymentType: "Web",
          PaymentStatus: "Successful",
          paymentReference: response.data.data.reference,
          paymentProcessor: "Paystack",
          orderStatus: "Processing",
        });
      }

      return response.data;
    } catch (error) {
      console.error;
    }
  }
}
