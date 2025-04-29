import Joi from 'joi';

export const checkoutValidationSchema = Joi.object({
  shippingAddress: Joi.string().min(10).max(100).required()
});
