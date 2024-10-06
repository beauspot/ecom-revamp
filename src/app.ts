// external dependencies
import "reflect-metadata";
import cors from "cors";
import path from "path";
import YAML from "yamljs";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { Server } from "http";
import "express-async-errors";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUI from "swagger-ui-express";
import { StatusCodes } from "http-status-codes";
import mongoSanitize from "express-mongo-sanitize";
import MongodbSession from "connect-mongodb-session";
import express, { NextFunction, Request, Response, Express } from "express";

// Reference path for sessions.
/// <reference path="./api/types/express/custom.d.ts" />

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

// module dependencies
import { __404_err_page } from "@/middlewares/notFound";
import errorHandlerMiddleware from "@/middlewares/errHandler";
import connectDb from "@/config/dbconfig";
import runRedisOperation, { disconnectRedis } from "@/config/redis.config";
import log from "@/utils/logger";

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

dotenv.config();
// const MongoDBStore = MongodbSession(session);

export class EcomApp {
  private readonly app: Express;
  private readonly Port: number | string;
  private server!: Server;

  // private store = new MongoDBStore({
  //   uri: process.env.MONGO_URL!,
  //   collection: "Sessions-Collection",
  //   expires: 60 * 60, // session will expire in 1hr
  // });

  constructor() {
    this.app = express();
    this.Port = process.env.PORT || 4000;
    this.middleware();
    this.routes();
  }

  public getApp(): Express {
    return this.app;
  }

  // Middleware functions
  private middleware(): void {
    this.app.set("trust proxy", 1);
    this.app.disable("x-powered-by");
    this.app.use(morgan("combined"));
    this.app.use(limiter);
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(mongoSanitize());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: false }));
    if (process.env.NODE_ENV !== "production") {
      this.app.use(morgan("tiny"));
    }
    this.app.use(
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
  }

  public routes(): void {
    this.app.use("/api/v1/mall/user", authRoute);
    this.app.use("/api/v1/mall/products", productRoute);
    this.app.use("/api/v1/mall/blogs", blogRoute);
    this.app.use("/api/v1/mall/brand", brandRoute);
    this.app.use("/api/v1/mall/blogscategory", blogCategoryRoute);
    this.app.use("/api/v1/mall/productscategory", productCategoryRoute);
    this.app.use("/api/v1/mall/coupon", couponRoute);
    this.app.use("/api/v1/mall/colors", colorRoute);
    this.app.use("/api/v1/mall/enquiry", enquiryRoute);
    this.app.use("/api/v1/mall/payment", paymentRoute);
    this.app.use("/api/v1/mall/orders", orderRoute);

    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).send(err.message);
        // next();
      }
    );
    this.app.use("/", (req: Request, res: Response, next: NextFunction) => {
      res
        .status(StatusCodes.PERMANENT_REDIRECT)
        .json({ message: "Welcome to the E-Commerce rest api application." });
    });

    this.app.all("*", __404_err_page);

    this.app.use(errorHandlerMiddleware);
  }

  public listen(port: number | string, cb: () => void): void {
    this.server = this.app.listen(port, cb);
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}
