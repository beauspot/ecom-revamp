import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

export const __404_err_page = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: "Resource cannot be found!" });
  // next();
};
