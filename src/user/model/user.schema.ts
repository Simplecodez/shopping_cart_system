import { Schema } from 'mongoose';
import { IUser } from '../interface/user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, unique: true },
    password: { type: String, required: true, trim: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

export { userSchema };
