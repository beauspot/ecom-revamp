import express from "express";
import { auth } from "@/middlewares/authMiddleware";
import OrderController from "@/controllers/order.controller";

const orderRouter = express.Router();

orderRouter.use(auth);

orderRouter.post("/", OrderController.createOrder);
orderRouter.get("/", OrderController.getOrders);

export default orderRouter;
