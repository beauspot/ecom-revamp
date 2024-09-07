import { StatusCodes } from "http-status-codes";
import CustomAPIError from "@/utils/custom-errors";

class UnauthenticatedError extends CustomAPIError {
  constructor(public message: string, public statusCode: number) {
    super(message, statusCode);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
