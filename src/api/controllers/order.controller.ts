import {Inject, Service} from "typedi";
import { Request, Response } from "express";

import { OrderService } from "@/services/order.service";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";

@Service()
export class OrderController {

  constructor(@Inject() private orderservice: OrderService){};

  async createOrder(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id as string;

    const order = await this.orderservice.create({
      products: req.body.products,
      paymentType: req.body.paymentType,
      paymentProcessor: req.body.paymentProcessor,
      orderby: userId,
    });

    res.json(order);
  }

  async getOrders(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id as string;

    const order = await this.orderservice.findAllByUserId(userId);

    res.send(order);
  }
};