import { Request } from 'express';
import { IBase } from '../../common/interface/base.interface';

export interface IUser extends IBase {
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}


export interface IRequest extends Request {
  user: IUser;
}
