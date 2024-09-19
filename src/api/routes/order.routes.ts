import { Router, Request, Response, NextFunction } from "express";

import { auth } from "@/middlewares/authMiddleware";
import { UserOrderModel } from "@/models/orderModel";
import { productModel } from "@/models/productsModels";
import { OrderService } from "@/services/order.service";
import { OrderController } from "@/controllers/order.controller";

const router = Router();
let orderservice = new OrderService(UserOrderModel, productModel);
let orderctrl = new OrderController(orderservice);

router.use(auth);

router
  .route("/")
  .post((req: Request, res: Response, next: NextFunction) =>
    orderctrl.createOrder(req, res)
  )
  .get((req: Request, res: Response) => orderctrl.getOrders(req, res));

export default router;
