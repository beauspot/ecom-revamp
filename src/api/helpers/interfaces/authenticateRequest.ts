import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export interface IDecoded {
  id: string;
}
