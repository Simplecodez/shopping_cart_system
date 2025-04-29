import { Types } from 'mongoose';
import { IBase } from '../../common/interface/base.interface';
import { ICart } from './cart.interface';
import { IProduct } from '../../product/interface/product.interface';

export interface ICartItem extends IBase {
  cart: string | ICart;
  product: string | IProduct;
  quantity: number;
}
