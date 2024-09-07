import { Response } from "express";
import { Document } from "mongoose";
import { CartModelInterface } from "./cartModel_Interface";
import { UserDataInterface } from "./user_interface";

// Define the structure of your form data
interface Form {
  email: UserDataInterface["email"];
  firstName: UserDataInterface["firstName"];
  lastName: UserDataInterface["lastName"];
  currency?: string;
  price:
    | CartModelInterface["totalAfterDiscount"]
    | CartModelInterface["cartTotal"];
  reference?: string;
  metadata?: { [key: string]: any };
}

interface Callback {
  (error: NodeJS.ErrnoException | null, response: Response): void;
}

interface PaymentData {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  metadata?: { [key: string]: any };
}

export { Form, Callback, PaymentData };
