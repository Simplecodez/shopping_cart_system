import { singleton } from 'tsyringe';
import { catchAsync } from '../utils/catch-async.utils';
import { IRequest } from '../user/interface/user.interface';
import { Request } from 'express';
import {
  addItemToCartValidationSchema,
  updateItemQuantityValidationSchema
} from './cart.validator';
import { CartService } from './cart.service';
import { resourceIdValidationSchema } from '../common/validator/id.validator';

@singleton()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  addItemToCart() {
    return catchAsync(async (req: IRequest | Request, res) => {
      await addItemToCartValidationSchema.validateAsync(req.body || {});
      const userId = (req as IRequest).user._id;
      const { productId, quantity } = req.body;
      await this.cartService.addItemToCart(userId as string, productId, quantity);

      res.status(200).json({
        status: 'success',
        message: 'Item added to cart successfully'
      });
    });
  }

  getUserCart() {
    return catchAsync(async (req: IRequest | Request, res) => {
      const userId = (req as IRequest).user._id;
      const cart = await this.cartService.findCartByUserId(userId as string);

      res.status(200).json({
        status: 'success',
        data: {
          cart
        }
      });
    });
  }

  removeItemFromCart() {
    return catchAsync(async (req: IRequest | Request, res) => {
      await resourceIdValidationSchema.validateAsync(req.params);
      const userId = (req as IRequest).user._id;
      const { id: itemId } = req.params;

      const message = await this.cartService.removeItemFromCart(userId as string, itemId);

      res.status(200).json({
        status: 'success',
        message
      });
    });
  }

  updateItemQuantity() {
    return catchAsync(async (req, res) => {
      await Promise.all([
        updateItemQuantityValidationSchema.validateAsync(req.body || {}),
        resourceIdValidationSchema.validateAsync(req.params || {})
      ]);

      const userId = (req as IRequest).user._id;
      const { id: itemId } = req.params;
      const { quantity } = req.body;

      const message = await this.cartService.updateItemQuanity(userId as string, itemId, quantity);

      res.status(200).json({
        status: 'success',
        message
      });
    });
  }

  clearCart() {
    return catchAsync(async (req: IRequest | Request, res) => {
      const userId = (req as IRequest).user._id;

      const message = await this.cartService.clearCart(userId as string);

      res.status(200).json({
        status: 'success',
        message
      });
    });
  }
}
