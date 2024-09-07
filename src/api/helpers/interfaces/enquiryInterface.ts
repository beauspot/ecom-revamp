import { Document } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  mobile: string;
  comment: string;
  status: "Submitted" | "Contacted" | "In Progress" | "Resolved";
}
