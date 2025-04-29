import { singleton } from 'tsyringe';
import { CartModel } from './model/cart/cart.model';
import { ICart } from './interface/cart.interface';
import { CartItemModel } from './model/cart-item/cart-item.model';
import { AppError } from './../utils/app-error.utils';
import { IProduct } from './../product/interface/product.interface';
import { RedisCache } from './../configs/redis/redis.service';
import { RedisLockService } from './../configs/redis/redis-lock.service';
import { ProductModel } from './../product/model/product.model';

@singleton()
export class CartService {
  constructor(
    private readonly cartModel: CartModel,
    private readonly cartItemModel: CartItemModel,
    private readonly productModel: ProductModel,
    private readonly cacheService: RedisCache,
    private readonly redisLockService: RedisLockService
  ) {}

  private async createCart(cartData: ICart) {
    return this.cartModel.model.create(cartData);
  }

  private getCartCacheKey(userId: string) {
    return `cart:${userId}`;
  }

  private async getCachedCart(userId: string) {
    const cacheKey = this.getCartCacheKey(userId);
    const cachedCart = await this.cacheService.get<ICart>(cacheKey);
    return { cacheKey, cachedCart };
  }

  private async findAndValidateCartByUserId(userId: string) {
    const cart = await this.cartModel.model.findOne({ user: userId }).lean();
    if (!cart) throw new AppError('Cart not found', 404, 'NotFound');
    return cart;
  }

  async getCartItemsAndTotalPrice(cartId: string) {
    const cartItems = await this.cartItemModel.model
      .find({ cart: cartId })
      .populate('product')
      .lean();

    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.quantity * (item.product as IProduct).price,
      0
    );

    return { cartItems, totalPrice };
  }

  private async updateCache(cartId: string, cachedCart: ICart, cacheKey: string) {
    const { cartItems, totalPrice: updatedCartTotalPrice } =
      await this.getCartItemsAndTotalPrice(cartId);
    cachedCart.totalPrice = updatedCartTotalPrice;
    cachedCart.items = cartItems;
    await this.cacheService.set(cacheKey, cachedCart);
  }

  async findCartByUserId(userId: string) {
    const { cacheKey, cachedCart } = await this.getCachedCart(userId);
    if (cachedCart) {
      return cachedCart;
    }
    const cart = await this.findAndValidateCartByUserId(userId);

    const { cartItems, totalPrice } = await this.getCartItemsAndTotalPrice(cart._id);

    const cartData = {
      ...cart,
      items: cartItems,
      totalPrice
    };

    await this.cacheService.set(cacheKey, cartData);
    return cartData;
  }

  async addItemToCart(userId: string, productId: string, quantity: number) {
    // This locks the cart for a user to prevent racing conditions from concurrent writes on a user cart
    const lock = await this.redisLockService.acquire(userId, 10000);
    try {
      let cart = await this.cartModel.model.findOne({ user: userId }).lean();
      if (!cart) {
        const cartDocument = await this.createCart({ user: userId });
        cart = cartDocument.toObject();
      }
      const product = await this.productModel.model.findById(productId).lean();
      if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');

      const cartItem = await this.cartItemModel.model
        .findOneAndUpdate(
          { cart: cart._id, product: productId },
          { $inc: { quantity } },
          { new: true, upsert: true }
        )
        .populate('product')
        .lean();

      const { cacheKey, cachedCart } = await this.getCachedCart(userId);

      if (cachedCart) {
        // This is recomputing cache from the db for high consistency
        await this.updateCache(cart._id, cachedCart, cacheKey);
      }
      return cartItem;
    } catch (error) {
      throw error;
    } finally {
      // Releases the lock once the write operation is completed
      await this.redisLockService.release(lock);
    }
  }

  async updateItemQuanity(userId: string, itemId: string, quantity = 1) {
    // This locks the cart for a user to prevent racing conditions from concurrent writes on a user cart
    const lock = await this.redisLockService.acquire(userId, 10000);
    try {
      const cart = await this.findAndValidateCartByUserId(userId);

      const cartItem = await this.cartItemModel.model
        .findOne({ _id: itemId, cart: cart._id })
        .lean();
      if (!cartItem) throw new AppError('Item not found in cart', 404, 'NOT_FOUND');

      const updatedQuantity = cartItem.quantity + quantity;

      if (updatedQuantity < 0) {
        throw new AppError('Cannot reduce quantity below zero (0)', 400, 'INVALID_QUANTITY');
      } else if (updatedQuantity === 0) {
        await this.cartItemModel.model.deleteOne({
          _id: itemId,
          cart: cart._id
        });
      } else {
        await this.cartItemModel.model.updateOne(
          { _id: itemId, cart: cart._id },
          { $set: { quantity: updatedQuantity } }
        );
      }

      const { cacheKey, cachedCart } = await this.getCachedCart(userId);

      if (cachedCart) {
        // This is recomputing cache from the db for high consistency
        await this.updateCache(cart._id, cachedCart, cacheKey);
      }
      return 'Item quantity updated successfully';
    } catch (error) {
      throw error;
    } finally {
      // Releases the lock once the write operation is completed
      await this.redisLockService.release(lock);
    }
  }

  async removeItemFromCart(userId: string, itemId: string) {
    const lock = await this.redisLockService.acquire(userId, 10000);
    try {
      const cart = await this.findAndValidateCartByUserId(userId);

      const result = await this.cartItemModel.model.deleteOne({
        _id: itemId,
        cart: cart._id
      });

      if (result.deletedCount === 0) throw new AppError('Item not found', 404, 'NotFound');

      const { cacheKey, cachedCart } = await this.getCachedCart(userId);

      if (cachedCart) {
        // This is recomputing cache from the db for high consistency
        await this.updateCache(cart._id, cachedCart, cacheKey);
      }

      return 'Item removed from cart successfully';
    } catch (error) {
      throw error;
    } finally {
      await this.redisLockService.release(lock);
    }
  }

  async clearCart(userId: string) {
    const cart = await this.findAndValidateCartByUserId(userId);

    const result = await this.cartItemModel.model.deleteMany({ cart: cart._id });

    if (result.deletedCount === 0) {
      throw new AppError('No items found in the cart', 404, 'NOT_FOUND');
    }
    const { cacheKey, cachedCart } = await this.getCachedCart(userId);

    if (cachedCart) {
      cachedCart.items = [];
      cachedCart.totalPrice = 0;
      await this.cacheService.set(cacheKey, cachedCart);
    }

    return 'Cart cleared successfully';
  }
}
