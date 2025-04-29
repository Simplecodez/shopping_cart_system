import Joi from 'joi';
import { IProduct } from './interface/product.interface';

export const createProductValidationSchema = Joi.object<IProduct>({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().max(50).required(),
  price: Joi.number().min(50).required(),
  stock: Joi.number().min(1).required()
});
