import { singleton } from 'tsyringe';
import { CartModel } from '../../cart/model/cart/cart.model';
import { CartItemModel } from '../../cart/model/cart-item/cart-item.model';
import { RedisCache } from '../../configs/redis/redis.service';
import { ICart } from '../../cart/interface/cart.interface';
import { AppError } from '../../utils/app-error.utils';
import { ICartItem } from '../../cart/interface/cart-item.interface';
import { IProduct } from '../../product/interface/product.interface';
import { IOrderItem } from '../interface/order-tem.interface';
import { OrderService } from './order.service';

@singleton()
export class CheckoutService {
  constructor(
    private readonly cartModel: CartModel,
    private readonly cartItemModel: CartItemModel,
    private readonly cacheService: RedisCache,
    private readonly orderService: OrderService
  ) {}

  private getCartCacheKey(userId: string) {
    return `cart:${userId}`;
  }

  private getTotalPrice(cartItems: ICartItem[]) {
    return cartItems.reduce(
      (acc, item) => acc + item.quantity * (item.product as IProduct).price,
      0
    );
  }

  async checkout(userId: string, shippingAddress: string) {
    const cacheKey = this.getCartCacheKey(userId);
    let cart = await this.cacheService.get<ICart>(cacheKey);
    let cartItems = cart?.items;
    let totalPrice = cart?.totalPrice;

    if (!cart) {
      cart = await this.cartModel.model.findOne({ user: userId });
      if (!cart) throw new AppError('Cart not found', 404, 'NOT_FOUND');

      cartItems = await this.cartItemModel.model
        .find({ cart: (cart as ICart)._id })
        .populate('product')
        .lean();
      if (cartItems.length <= 0) throw new AppError('Cart is empty', 404, 'NOT_FOUND');

      totalPrice = this.getTotalPrice(cartItems);
    }

    // This is just to simulate a payment. In a real application,
    // I will decouple the payment and process it asynchronously using BullMQ,
    // Kafka or RabbitMQ in a microservice architecture which is favoured for this
    // kind of application.
    // Once payment is confirmed via a webhook, the order is created.
    const paymentSuccess = true;

    if (!paymentSuccess)
      throw new AppError('Payment failed, please try again later', 422, 'FAILED_PAYMENT');

    const itemsToBeOrdered: IOrderItem[] = (cartItems as ICartItem[]).map((cartItem) => ({
      product: (cartItem.product as IProduct)._id as string,
      quantity: cartItem.quantity,
      itemTotalPrice: (cartItem.product as IProduct).price * cartItem.quantity
    }));

    // Ideally in a real app, this should be handled by a queue - decoupling the checkout
    // from payment and order creation.
    // Once the payment is confirmed, the order event is dispatched to the order service
    // which handles the creation of the of the order.
    // So, a real ecommerce app, the create order event is to fired by the payment service
    // in a microservice.
    return await this.orderService.createOrder(
      userId,
      cart._id as string,
      shippingAddress,
      itemsToBeOrdered,
      totalPrice as number
    );
  }
}
