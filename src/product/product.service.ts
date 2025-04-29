import { singleton } from 'tsyringe';
import { ProductModel } from './model/product.model';
import { IProduct } from './interface/product.interface';

@singleton()
export class ProductService {
  constructor(private readonly productModel: ProductModel) {}

  addProduct(productData: IProduct): Promise<IProduct> {
    return this.productModel.model.create(productData);
  }

  getAllProducts(): Promise<IProduct[]> {
    return this.productModel.model.find().lean();
  }

  getProductById(id: string): Promise<IProduct | null> {
    return this.productModel.model.findById(id).lean();
  }
}
