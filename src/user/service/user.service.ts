import { singleton } from 'tsyringe';
import { UserModel } from '../model/user.model';
import { IUser } from '../interface/user.interface';

@singleton()
export class UserService {
  constructor(private readonly userModel: UserModel) {}

  createUser(userData: IUser) {
    return this.userModel.model.create(userData);
  }

  findUserByEmail(email: string) {
    return this.userModel.model.findOne({ email }).lean();
  }

  findUserById(id: string) {
    return this.userModel.model.findById(id).lean();
  }
}
