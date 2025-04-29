import express, { Application } from 'express';
import { singleton } from 'tsyringe';
import { ProductRouter } from './product/product.router';
import { GlobalErrorHandler } from './common/middlewares/global-error.handler';
import { CartRouter } from './cart/cart.router';
import { AuthRouter } from './auth/auth.router';
import { CheckoutRouter } from './checkout/router/checkout.router';
import { OrderRouter } from './checkout/router/order.router';

@singleton()
export class App {
  private app: Application;
  constructor(
    private readonly authRouter: AuthRouter,
    private readonly cartRouter: CartRouter,
    private readonly productRouter: ProductRouter,
    private readonly checkoutRouter: CheckoutRouter,
    private readonly orderRouter: OrderRouter
  ) {
    this.app = express();
    this.initializeMiddlware();
    this.initializeRoutes();
    this.initializeGlobalRouteHandling();
    this.initializeErrorHandling();
  }

  private initializeMiddlware() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.use('/api/v1/auth', this.authRouter.getRouter);
    this.app.use('/api/v1/carts', this.cartRouter.getRouter);
    this.app.use('/api/v1/products', this.productRouter.getRouter);
    this.app.use('/api/v1/checkout', this.checkoutRouter.getRouter);
    this.app.use('/api/v1/orders', this.orderRouter.getRouter);
  }

  private initializeGlobalRouteHandling() {
    this.app.use((req, res) => {
      res.status(404).json({
        status: 'fail',
        message: `Cannot find ${req.originalUrl} on this server`
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(GlobalErrorHandler.errorHandler());
  }

  start() {
    this.app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  }
}
