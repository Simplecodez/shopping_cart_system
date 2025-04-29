import { Router } from 'express';
import { singleton } from 'tsyringe';
import { AuthController } from './auth.controller';

@singleton()
export class AuthRouter {
  private router = Router();
  constructor(private readonly authController: AuthController) {
    this.initialize();
  }

  private initialize() {
    this.router.post('/register', this.authController.register());
    this.router.post('/login', this.authController.login());
  }

  get getRouter() {
    return this.router;
  }
}
