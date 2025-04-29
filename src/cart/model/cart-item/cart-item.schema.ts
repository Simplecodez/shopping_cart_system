import { Schema } from 'mongoose';
import { ICartItem } from '../../interface/cart-item.interface';

export const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

CartItemSchema.index({ product: 1 });
CartItemSchema.index({ card: 1 });
