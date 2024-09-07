import { Request as ExpressRequest, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

interface Request extends ExpressRequest {
  user?: any;
}

export const verifyRefToken = (req:Request, res:Response, next:NextFunction) => {
  const refreshToken = req.headers["x-refresh-token"] || req.body.refreshToken;

  if (!refreshToken) return res.status(StatusCodes.UNAUTHORIZED);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN!) as JwtPayload;
    req.user = decoded.userId as JwtPayload;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid refresh Token" });
  }
};
