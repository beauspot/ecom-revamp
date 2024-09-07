import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { UserOrderModel } from "@/models/orderModel";
import { productModel } from "@/models/productsModels";
import {
  CreateOrderParams,
  OrderInterface,
} from "@/interfaces/order_interface";

export class OrderService {
  public static async create(data: CreateOrderParams): Promise<any> {
    try {
      const productIds: string[] = data.products.map(
        (product) => product.product
      );

      const products = await productModel.find({ _id: { $in: productIds } });

      // TODO: Handle if a product in the createorderparams is not found
      // throw error or just return the one that were found
      const hydratedProducts = data.products.map((product) => {
        const detailedProduct = products.find((i) => i._id == product.product);
        return { ...product, price: detailedProduct?.price };
      });

      const order = await UserOrderModel.create({
        ...data,
        products: hydratedProducts,
      });

      const totalCost: number = order.products.reduce(
        (total, current) => total + current.price * current.count,
        0
      );
      return { order, totalCost };
    } catch (error) {
      throw new Error("Error creating order");
    }
  }

  public static async findAllByUserId(
    userId: string
  ): Promise<OrderInterface[]> {
    try {
      const orders = await UserOrderModel.find({ orderby: userId }).exec();
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders");
    }
  }
}
