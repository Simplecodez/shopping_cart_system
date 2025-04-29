import { singleton } from 'tsyringe';
import { OrderModel } from '../model/order.model';
import { AppError } from '../../utils/app-error.utils';
import { ProductModel } from '../../product/model/product.model';
import { IOrderItem } from '../interface/order-tem.interface';
import { RedisLockService } from '../../configs/redis/redis-lock.service';
import { CartItemModel } from '../../cart/model/cart-item/cart-item.model';

@singleton()
export class OrderService {
  constructor(
    private readonly orderModel: OrderModel,
    private readonly productModel: ProductModel,
    private readonly cartItemModel: CartItemModel,
    private readonly redisLockService: RedisLockService
  ) {}

  // In  a real world application this will be handled asynchronously using a message
  // queue system like RabbitMQ, Kafka - BullMQ can also be used to handle this once payment is confirmed from the payment service.
  async createOrder(
    userId: string,
    cartId: string,
    shippingAddress: string,
    itemsToOrder: IOrderItem[],
    itemsTotalPrice: number
  ) {
    const lockPromises = itemsToOrder.map((item) =>
      this.redisLockService.acquire(item.product.toString(), 30000)
    );
    const locks = await Promise.all(lockPromises);
    try {
      const productIds = itemsToOrder.map((item) => item.product);

      const products = await this.productModel.model
        .find({ _id: { $in: productIds } })
        .select('+stock')
        .lean();

      const outOfStockProducts = products.filter((product) => {
        const orderedItem = itemsToOrder.find(
          (item) => item.product.toString() === product._id.toString()
        );
        return product.stock < (orderedItem as IOrderItem).quantity;
      });

      if (outOfStockProducts.length !== 0) {
        const outOfStockProductNames = outOfStockProducts.map((product) => product.name);
        const errorMessage = `The following products are out of stock: ${outOfStockProductNames.join(', ')}`;
        throw new AppError(errorMessage, 409, 'CONFLICT');
      }

      const session = await this.orderModel.model.db.startSession();

      await session.withTransaction(async () => {
        await this.orderModel.model.create(
          [
            {
              user: userId,
              items: itemsToOrder,
              totalPrice: itemsTotalPrice,
              paymentStatus: 'completed',
              shippingAddress
            }
          ],
          { session }
        );

        const bulkProductStockUpdate = itemsToOrder.map((item) => {
          return {
            updateOne: {
              filter: {
                _id: item.product,
                stock: { $gte: item.quantity }
              },
              update: { $inc: { stock: -item.quantity } }
            }
          };
        });

        await this.productModel.model.bulkWrite(bulkProductStockUpdate, { session });
        await this.cartItemModel.model.deleteMany({ cart: cartId });
      });

      return 'Order created successfully';
    } catch (error) {
      throw error;
    } finally {
      const lockReleasePromises = locks.map((lock) => lock.release());
      await Promise.all(lockReleasePromises);
    }
  }

  findAllOrders(userId?: string) {
    const query = userId ? { user: userId } : {};
    return this.orderModel.model.find(query).populate('items.product');
  }
}
