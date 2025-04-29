import { Router } from 'express';
import { singleton } from 'tsyringe';
import { CartController } from './cart.controller';
import { ProtectMiddleware } from '../common/middlewares/protect.middleware';

@singleton()
export class CartRouter {
  private router = Router();
  constructor(
    private readonly cartController: CartController,
    private readonly protectMiddleware: ProtectMiddleware
  ) {
    this.initialize();
  }

  private initialize() {
    this.router.use(this.protectMiddleware.protect(), this.protectMiddleware.restrictTo('user'));

    this.router.post('/items', this.cartController.addItemToCart());
    this.router.get('/items', this.cartController.getUserCart());
    this.router.patch('/items/:id', this.cartController.updateItemQuantity());
    this.router.delete('/items/:id', this.cartController.removeItemFromCart());
    this.router.delete('/items', this.cartController.clearCart());
  }

  get getRouter() {
    return this.router;
  }
}
