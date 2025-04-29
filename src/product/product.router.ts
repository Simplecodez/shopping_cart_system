import { Router } from 'express';
import { singleton } from 'tsyringe';
import { ProtectMiddleware } from '../common/middlewares/protect.middleware';
import { ProductController } from './product.controller';

@singleton()
export class ProductRouter {
  private router = Router();
  constructor(
    private readonly productController: ProductController,
    private readonly protectMiddleware: ProtectMiddleware
  ) {
    this.initialize();
  }

  private initialize() {
    this.router.use(this.protectMiddleware.protect());
    this.router.post(
      '/',
      this.protectMiddleware.restrictTo('admin'),
      this.productController.createProduct()
    );
    this.router.get(
      '/',
      this.protectMiddleware.restrictTo('admin', 'user'),
      this.productController.getAllProducts()
    );
  }

  get getRouter() {
    return this.router;
  }
}
