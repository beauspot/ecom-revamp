import mongoose, { Schema } from "mongoose";
import { IEnquiry } from "@/interfaces/enquiryInterface";

const enquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Submitted",
      enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
    },
  },
  { timestamps: true }
);

export const EnquiryDataModel = mongoose.model<IEnquiry>(
  "EnquiryModel",
  enquirySchema
);
