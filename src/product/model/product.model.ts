import mongoose, { Model } from 'mongoose';
import { singleton } from 'tsyringe';
import IModel from '../../configs/database/model.interface';
import { IProduct } from '../interface/product.interface';
import { ProductSchema } from './product.schema';

@singleton()
export class ProductModel implements IModel<IProduct> {
  public model: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);
}
