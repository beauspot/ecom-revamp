import { checkoutModel } from "@/models/checkout_model";
import { PaymentData } from "@/interfaces/paystack_init.interface";
import { InitializePaymentInput } from "@/helpers/types/payment_init";
import { initializePayment, verifyPayment } from "@/helpers/utils/paystack.utils";

export class PaymentService {
  async startPayment(data: PaymentData) {
    try {
      const paymentData: InitializePaymentInput = {
        amount: data.amount * 100,
        currency: "NGN",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        metadata: {
          full_name: data.firstName + " " + data.lastName,
        },
      
      };

      return await initializePayment(paymentData);
    } catch (error) {
      console.error;
    }
  }

  async createPayment(reference: string) {
    try {
      const response = await verifyPayment(reference);
      const data = response?.data;
      const payment = await checkoutModel.create({
        reference: data.reference,
        amount: data.amount,
        email: data.customer.email,
        full_name: data.metadata.full_name,
        status: data.status,
      });

      return payment;
    } catch (error) {
      console.error;
    }
  }

  async paymentReceipt(reference: string) {
    try {
      const transaction = await checkoutModel.findOne({ reference: reference });
      return transaction;
    } catch (error: any) {
      error.source = "Payment Receipt";
      console.error;
    }
  }
}