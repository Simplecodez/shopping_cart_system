import { Types } from 'mongoose';
import { IBase } from '../../common/interface/base.interface';
import { IUser } from '../../user/interface/user.interface';
import { ICartItem } from './cart-item.interface';

export interface ICart extends IBase {
  user: string | IUser;
  items?: ICartItem[];
  totalPrice?: number;
}
