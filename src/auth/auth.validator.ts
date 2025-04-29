import Joi from "joi";

export const registerValidationSchema = Joi.object({
  fullName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).max(30).required(),
});
