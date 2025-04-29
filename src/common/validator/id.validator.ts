import Joi from 'joi';
import mongoose from 'mongoose';
import { AppError } from '../../utils/app-error.utils';

export const resourceIdValidationSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .error(new AppError('Invalid resource ID', 400, 'INVALID_RS_ID'))
});

export const optionalResourceIdValidationSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .optional()
    .error(new AppError('Invalid resource ID', 400, 'INVALID_RS_ID'))
});
