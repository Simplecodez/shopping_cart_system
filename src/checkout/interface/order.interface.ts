import { Types } from 'mongoose';
import { IBase } from '../../common/interface/base.interface';
import { IProduct } from '../../product/interface/product.interface';
import { IUser } from '../../user/interface/user.interface';

export interface IOrder {
  user: Types.ObjectId | IUser;
  items: { product: IProduct; quantity: number; itemtotalPrice: number }[];
  totalPrice: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  shipped: boolean;
  shippingAddress: string;
}

export interface IOrderDocument extends IOrder, IBase {}
