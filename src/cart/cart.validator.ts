import Joi from 'joi';
import { AppError } from '../utils/app-error.utils';
import mongoose from 'mongoose';

export const addItemToCartValidationSchema = Joi.object({
  productId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .error(new AppError('Invalid resource ID', 400, 'INVALID_RS_ID')),
  quantity: Joi.number().integer().min(1).max(40).required()
});

export const updateItemQuantityValidationSchema = Joi.object({
  quantity: Joi.number().integer().max(40).optional()
});
