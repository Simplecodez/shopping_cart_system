import mongoose, { Model } from 'mongoose';
import IModel from '../../../configs/database/model.interface';
import { singleton } from 'tsyringe';
import { ICart } from '../../interface/cart.interface';
import { CartSchema } from './cart.schema';

@singleton()
export class CartModel implements IModel<ICart> {
  public model: Model<ICart> = mongoose.model<ICart>('Cart', CartSchema);
}
