import { singleton } from 'tsyringe';
import { CheckoutService } from '../service/checkout.service';
import { catchAsync } from '../../utils/catch-async.utils';
import { IRequest } from '../../user/interface/user.interface';
import { Request } from 'express';
import { checkoutValidationSchema } from '../checkout.validator';

@singleton()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  checkout() {
    return catchAsync(async (req: IRequest | Request, res) => {
      await checkoutValidationSchema.validateAsync(req.body || {});
      const userId = (req as IRequest).user._id;

      const { shippingAddress } = req.body;
      const message = await this.checkoutService.checkout(userId as string, shippingAddress);

      res.status(200).json({
        status: 'success',
        message
      });
    });
  }
}
