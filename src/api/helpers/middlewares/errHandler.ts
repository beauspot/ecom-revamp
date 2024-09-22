import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

import { CustomAPIError, ServiceAPIError } from "@/helpers/utils/custom-errors";
const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  else if (err instanceof ServiceAPIError) {
    return res.json({msg: err.message});
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  next(err);
  // console.log(err);
  // return res.status(500).json({ msg: err.message });
};

export default errorHandlerMiddleware;
