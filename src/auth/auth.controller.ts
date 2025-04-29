import { singleton } from 'tsyringe';
import { AuthService } from './service/auth.service';
import { catchAsync } from '../utils/catch-async.utils';
import { loginValidationSchema, registerValidationSchema } from './auth.validator';

@singleton()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register() {
    return catchAsync(async (req, res) => {
      await registerValidationSchema.validateAsync(req.body || {});
      const user = await this.authService.register(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          user
        }
      });
    });
  }

  login() {
    return catchAsync(async (req, res) => {
      await loginValidationSchema.validateAsync(req.body || {});
      const { email, password } = req.body;

      const token = await this.authService.login(email, password);

      res.status(200).json({
        status: 'success',
        data: {
          token
        }
      });
    });
  }
}
