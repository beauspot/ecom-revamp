import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";
import { OrderService } from "@/services/order.service";

export default class OrderController {
  public static async createOrder(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id as string;

    const order = await OrderService.create({
      products: req.body.products,
      paymentType: req.body.paymentType,
      paymentProcessor: req.body.paymentProcessor,
      orderby: userId,
    });

    res.send(order);
  }

  public static async getOrders(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id as string;

    const order = await OrderService.findAllByUserId(userId);

    res.send(order);
  }
}
