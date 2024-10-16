import "reflect-metadata";
import cors from "cors";
import path from "path";
import YAML from "yamljs";
import morgan from "morgan";
import helmet from "helmet";
import { Server } from "http";
import "express-async-errors";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUI from "swagger-ui-express";
import { StatusCodes } from "http-status-codes";
import mongoSanitize from "express-mongo-sanitize";
import MongodbSession from "connect-mongodb-session";
import express, { NextFunction, Request, Response, Express } from "express";

import { __404_err_page } from "@/middlewares/notFound";
import errorHandlerMiddleware from "@/middlewares/errHandler";

// Routes Imports
import authRoute from "@/routes/auth.routes";
import colorRoute from "@/routes/color.routes";
import productRoute from "@/routes/product.routes";
import enquiryRoute from "@/routes/enq.routes";
import blogRoute from "@/routes/blog.routes";
import blogCategoryRoute from "@/routes/blogCategory.routes";
import productCategoryRoute from "@/routes/productCategory.routes";
import brandRoute from "@/routes/brands.routes";
import couponRoute from "@/routes/coupon.routes";
import paymentRoute from "@/routes/payment.routes";
import orderRoute from "@/routes/order.routes";

// import { swaggerSpecs } from "@/config/swagger.config";

// Reference path for sessions.
/// <reference path="./api/types/express/custom.d.ts" />

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

function createServer() {
  // let server!: Server;

  const app = express();
  const swaggerSpecs = YAML.load(path.join(__dirname, "./../swagger.yaml"));

  app.use(express.json());
  app.use(morgan("combined"));
  app.use(limiter);
  app.use(cors());
  app.use(helmet());
  app.use(mongoSanitize());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("tiny"));
  }
  app.use(
    session({
      resave: false,
      secret: process.env.SESSION_SECRET_KEY!,
      saveUninitialized: false,
      // store: this.store,
      cookie: {
        sameSite: "strict",
        secure: false, // use true if using https
        maxAge: 1000 * 60 * 60, // cookie would expire in 1 hour
      },
    })
  );

  app.use("/api/v1/mall/user", authRoute);
  app.use("/api/v1/mall/products", productRoute);
  app.use("/api/v1/mall/blogs", blogRoute);
  app.use("/api/v1/mall/brand", brandRoute);
  app.use("/api/v1/mall/blogscategory", blogCategoryRoute);
  app.use("/api/v1/mall/productscategory", productCategoryRoute);
  app.use("/api/v1/mall/coupon", couponRoute);
  app.use("/api/v1/mall/colors", colorRoute);
  app.use("/api/v1/mall/enquiry", enquiryRoute);
  app.use("/api/v1/mall/payment", paymentRoute);
  app.use("/api/v1/mall/orders", orderRoute);
  app.use(
    "/api/v1/mall/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpecs, { explorer: false })
  );

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(err.message);
    // next();
  });
  app.use("/", (req: Request, res: Response, next: NextFunction) => {
    res
      .status(StatusCodes.PERMANENT_REDIRECT)
      .json({ message: "Welcome to the E-Commerce rest api application." });
  });

  app.all("*", __404_err_page);

  app.use(errorHandlerMiddleware);

  return app;
}

export default createServer;
