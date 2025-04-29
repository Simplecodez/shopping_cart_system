import { singleton } from 'tsyringe';
import { IncomingHttpHeaders } from 'http';
import { NextFunction, Request } from 'express';
import { catchAsync } from '../../utils/catch-async.utils';
import { AppError } from '../../utils/app-error.utils';
import { CommonUtils } from '../../utils/common.utils';
import { UserService } from '../../user/service/user.service';
import { IRequest } from '../../user/interface/user.interface';

@singleton()
export class ProtectMiddleware {
  constructor(private readonly userService: UserService) {}

  private extractJWTToken(reqAuth: {
    headers: IncomingHttpHeaders;
    cookies: { authToken: string };
  }) {
    let token: string | undefined;
    if (reqAuth.headers.authorization && reqAuth.headers.authorization.startsWith('Bearer')) {
      token = reqAuth.headers.authorization.split(' ')[1];
    } else if (reqAuth.cookies && reqAuth.cookies.authToken) {
      token = reqAuth.cookies.authToken;
    }
    return token;
  }

  private async authenticate(reqAuth: {
    headers: IncomingHttpHeaders;
    cookies: { authToken: string };
  }) {
    const authToken = this.extractJWTToken(reqAuth);
    if (!authToken)
      throw new AppError('Please, provide a valid token', 401, 'INVALID_ACCESS_TOKEN');

    const decoded: { id: string; tokenVersion: string } =
      await CommonUtils.verifyJWTToken(authToken);

    const user = await this.userService.findUserById(decoded.id).select('+role');
    if (!user) throw new AppError('Invalid token', 401, 'INVALID_ACCESS_TOKEN');

    return user;
  }

  protect() {
    return catchAsync(async (req: Request | IRequest, res, next) => {
      const authorisedUser = await this.authenticate({
        headers: (req as Request).headers,
        cookies: { authToken: (req as Request).cookies?.authToken }
      });

      (req as IRequest).user = authorisedUser;
      (next as NextFunction)();
    });
  }

  restrictTo(...roles: ('user' | 'admin')[]) {
    return catchAsync(async (req: Request | IRequest, res, next) => {
      const userRole = (req as IRequest).user.role;
      if (!roles.includes(userRole))
        throw new AppError('Access forbidden', 403, 'ACCESS_FORBIDDEN');

      (next as NextFunction)();
    });
  }
}
