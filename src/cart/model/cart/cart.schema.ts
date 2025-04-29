import { Schema } from 'mongoose';
import { ICart } from '../../interface/cart.interface';

export const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

CartSchema.index({ user: 1 });
