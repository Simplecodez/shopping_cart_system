import { Schema } from 'mongoose';
import { IProduct } from '../interface/product.interface';

export const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      select: false
    }
  },
  {
    timestamps: true
  }
);

ProductSchema.index({ name: 1 });
ProductSchema.index({ price: 1 });
