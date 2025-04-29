import { singleton } from 'tsyringe';
import { UserService } from '../../user/service/user.service';
import { AppError } from '../../utils/app-error.utils';
import { CommonUtils } from '../../utils/common.utils';

@singleton()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(userData: any) {
    const user = await this.userService.createUser(userData);
    const { password, role, __v, createdAt, updatedAt, ...otherUserData } = user.toObject();
    return otherUserData;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email).select('+password');

    if (!user || !(await CommonUtils.verifyPassword(password, user.password))) {
      throw new AppError('Invalid credentials', 401, 'InvalidCredentials');
    }

    return CommonUtils.signToken(user._id);
  }
}
