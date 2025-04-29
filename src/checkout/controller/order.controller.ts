import { singleton } from 'tsyringe';
import { OrderService } from '../service/order.service';
import { catchAsync } from '../../utils/catch-async.utils';
import {
  optionalResourceIdValidationSchema,
  resourceIdValidationSchema
} from '../../common/validator/id.validator';

@singleton()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  getAllOrders() {
    return catchAsync(async (req, res) => {
      await optionalResourceIdValidationSchema.validateAsync({ id: req.query.userId });
      const userId = req.query.userId as string;
      const orders = await this.orderService.findAllOrders(userId);

      res.status(200).json({
        status: 'success',
        data: {
          orders
        }
      });
    });
  }
}
