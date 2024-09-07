import { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    isAuth?: boolean;
    // Add other custom properties as needed
  }
}
