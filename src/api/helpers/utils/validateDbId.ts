import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

import CustomAPIError from "@/utils/custom-errors";

export const validateMongoDbID = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid)
    throw new CustomAPIError("This ID is not valid", StatusCodes.FORBIDDEN);
};
