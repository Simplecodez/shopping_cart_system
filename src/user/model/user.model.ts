import mongoose, { Model } from 'mongoose';
import IModel from '../../configs/database/model.interface';
import { IUser } from '../interface/user.interface';
import { userSchema } from './user.schema';
import { singleton } from 'tsyringe';

@singleton()
export class UserModel implements IModel<IUser> {
  public model: Model<IUser> = mongoose.model<IUser>('User', userSchema);
}
