import {Inject, Service} from "typedi";

import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { UserOrderModel } from "@/models/orderModel";
import { productModel } from "@/models/productsModels";
import {ServiceAPIError}  from "@/helpers/utils/custom-errors";
import {
  CreateOrderParams,
  OrderInterface,
} from "@/interfaces/order_interface";

@Service()
export class OrderService {
  constructor(
    @Inject(() => UserOrderModel) private ordermodel: typeof UserOrderModel,
    @Inject(() => productModel) private productmodel: typeof productModel
  ) {}

  async create(data: CreateOrderParams): Promise<any> {
    try {
      const productIds: string[] = data.products.map(
        (product) => product.product
      );

      const products = await this.productmodel.find({ _id: { $in: productIds } });

      // TODO: Handle if a product in the createorderparams is not found
      // throw error or just return the one that were found
      const hydratedProducts = data.products.map((product) => {
        const detailedProduct = products.find((i) => i._id == product.product);
        return { ...product, price: detailedProduct?.price };
      });

      const order = await this.ordermodel.create({
        ...data,
        products: hydratedProducts,
      });

      const totalCost: number = order.products.reduce(
        (total, current) => total + current.price * current.count,
        0
      );
      return { order, totalCost };
    } catch (error: any) {
      throw new ServiceAPIError("Error creating order");
    }
  }

  async findAllByUserId(
    userId: string
  ): Promise<OrderInterface[]> {
    try {
      const orders = await this.ordermodel.find({ orderby: userId }).exec();
      return orders;
    } catch (error: any) {
      throw new ServiceAPIError("Error fetching orders");
    }
  }
}
