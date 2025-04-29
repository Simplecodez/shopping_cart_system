import { IProduct } from '../../product/interface/product.interface';

export interface IOrderItem {
  product: string | IProduct;
  quantity: number;
  itemTotalPrice: number;
}
