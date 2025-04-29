import mongoose, { Model } from 'mongoose';
import IModel from '../../../configs/database/model.interface';
import { singleton } from 'tsyringe';
import { ICartItem } from '../../interface/cart-item.interface';
import { CartItemSchema } from './cart-item.schema';

@singleton()
export class CartItemModel implements IModel<ICartItem> {
  public model: Model<ICartItem> = mongoose.model<ICartItem>('CartItem', CartItemSchema);
}
