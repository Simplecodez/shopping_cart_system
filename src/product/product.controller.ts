import { singleton } from 'tsyringe';
import { ProductService } from './product.service';
import { catchAsync } from '../utils/catch-async.utils';
import { createProductValidationSchema } from './product.validator';
@singleton()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  createProduct() {
    return catchAsync(async (req, res) => {
      const productData = req.body;
      await createProductValidationSchema.validateAsync(productData || {});
      const product = await this.productService.addProduct(productData);
      res.status(201).json({ status: 'success', data: { product } });
    });
  }

  getAllProducts() {
    return catchAsync(async (req, res) => {
      const products = await this.productService.getAllProducts();
      res.status(200).json({ status: 'success', data: { products } });
    });
  }
}
