import { IBase } from '../../common/interface/base.interface';

export interface IProduct extends IBase {
  name: string;
  description: string;
  price: number;
  stock: number;
}
