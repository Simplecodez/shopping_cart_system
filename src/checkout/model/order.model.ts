import mongoose, { Model } from 'mongoose';
import { singleton } from 'tsyringe';
import { IOrderDocument } from '../interface/order.interface';
import IModel from '../../configs/database/model.interface';
import { OrderSchema } from './order.schema';

@singleton()
export class OrderModel implements IModel<IOrderDocument> {
  public model: Model<IOrderDocument> = mongoose.model<IOrderDocument>('Order', OrderSchema);
}
