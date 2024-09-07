/* 
    create the function that calls paystack-API and 
    submits our transaction details and authorization 
    headers to initialize and verify them.
*/

import dotenv from "dotenv";
import axios from "axios";
import { InitializePaymentInput } from "../types/payment_init";

dotenv.config();

export const initializePayment = async (data: InitializePaymentInput) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      data,
      {
        headers: {
          authorization: `Bearer ${process.env.PAY_STACK_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": "calculated when request is sent", 
          "Host": "calculated when request is sent"
        },
      }
    );

    return response;
  } catch (error) {
    console.error;
  }
};

export const verifyPayment = async (reference: string) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          authorization: `Bearer ${process.env.PAY_STACK_API_KEY}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    return response;
  } catch (error) {
    console.error;
  }
};
