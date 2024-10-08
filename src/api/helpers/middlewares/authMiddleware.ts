import lodash from "lodash";
import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import logger from "@/utils/logger"
import { authModel } from "@/models/userModels";
import UnauthenticatedError from "@/helpers/utils/unauthenticated";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";

// Define a type guard function for JwtPayload
function isJwtPayload(decoded: any): decoded is JwtPayload {
  return typeof decoded === "object" && "id" in decoded;
}

// creating the authentication middleware to authenticate the user.
export const auth = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      // logger.info("token Data: ", token);
      // logger.info("Request User Data: ", req.user);
      try {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          // logger.info(decoded.id);
          if (isJwtPayload(decoded)) {
            logger.info(decoded.id);
          }
          const user = await authModel.findById(decoded.id);
          // TODO: what happens if user is undefined
          if (!lodash.isUndefined(user)) {
            req.user = { id: user?.id };
            next();
          }
        }
      } catch (error) {
        throw new UnauthenticatedError(
          "Not Athorized token expired, Please Login again.",
          StatusCodes.UNAUTHORIZED
        );
      }
    } else {
      throw new UnauthenticatedError(
        "There is no token atached to the Header.",
        StatusCodes.UNAUTHORIZED
      );
    }
  }
);

// Creating the middleware to handle the admin authorization and authentication
export const isAdmin = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("UserData ->>>", req.user);
    const { user } = req;
    if (user) {
      const { id } = user;
      // logger.info("User ->>>", user);
      // logger.info("UserID ->>>", id);
      const adminUser = await authModel.findOne({ id });
      // logger.info(adminUser);
      if (adminUser && adminUser.role !== "admin")
        throw new UnauthenticatedError(
          "You are not an an administrator",
          StatusCodes.UNAUTHORIZED
        );
      else {
        next();
      }
    } else {
      throw new UnauthenticatedError(
        "User Information Not found Please authenticate first.",
        StatusCodes.UNAUTHORIZED
      );
    }
  }
);
