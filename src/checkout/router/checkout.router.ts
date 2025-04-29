import { Router } from 'express';
import { singleton } from 'tsyringe';
import { ProtectMiddleware } from '../../common/middlewares/protect.middleware';
import { CheckoutController } from '../controller/checkout.controller';

@singleton()
export class CheckoutRouter {
  private router = Router();
  constructor(
    private readonly checkoutController: CheckoutController,
    private readonly protectMiddleware: ProtectMiddleware
  ) {
    this.initialize();
  }

  private initialize() {
    this.router.use(this.protectMiddleware.protect(), this.protectMiddleware.restrictTo('user'));
    this.router.post('/cart', this.checkoutController.checkout());
  }

  get getRouter() {
    return this.router;
  }
}
