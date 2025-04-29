import { Schema } from 'mongoose';
import { IOrderDocument } from '../interface/order.interface';

export const OrderSchema = new Schema<IOrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          required: true
        },
        itemTotalPrice: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    shipped: {
      type: Boolean,
      default: false
    },
    shippingAddress: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ paymentStatus: 1 });
