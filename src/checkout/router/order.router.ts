import { Router } from 'express';
import { singleton } from 'tsyringe';
import { ProtectMiddleware } from '../../common/middlewares/protect.middleware';
import { OrderController } from '../controller/order.controller';

@singleton()
export class OrderRouter {
  private router = Router();
  constructor(
    private readonly checkoutController: OrderController,
    private readonly protectMiddleware: ProtectMiddleware
  ) {
    this.initialize();
  }

  private initialize() {
    this.router.use(this.protectMiddleware.protect(), this.protectMiddleware.restrictTo('admin'));
    this.router.get('/', this.checkoutController.getAllOrders());
  }

  get getRouter() {
    return this.router;
  }
}
