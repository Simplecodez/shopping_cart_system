import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/app-error.utils';

export class GlobalErrorHandler {
  static handleJoiValidationError(error: any): AppError {
    let message = error.message;
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static handleDuplicateDB(err: any): AppError {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Field value: ${value} already exist. Please use another value!`;
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static handleValidationErrorDB(err: any) {
    const errors = Object.values(err.errors).map((el: any) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static handleBadJsonFormatError(): AppError {
    return new AppError('Invalid JSON format, please check your request body.', 400, 'BAD_REQUEST');
  }

  static handleAcquireLocKError(error: any) {
    return new AppError(
      "Sorry, we're currently unable to process your request. Please try again shortly.",
      503
    );
  }
  static handleJWTError() {
    return new AppError('Invalid token. Please log in again!', 401, 'INVALID_TOKEN');
  }

  static handleJWTExpiredError() {
    return new AppError('Your token has expired! Please log in again.', 401, 'INVALID_TOKEN');
  }

  static sendError(err: AppError, res: Response) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        code: err?.code
      });
    }

    console.log(err);

    return res.status(500).json({
      status: 'error',
      message: 'Sorry, an error occurred. Please try again later.',
      CODE: 'INTERNAL_SERVER_ERROR'
    });
  }

  static errorHandler() {
    return (error: any, req: Request, res: Response, next: NextFunction) => {
      if (error.name === 'ValidationError' && error.isJoi)
        error = this.handleJoiValidationError(error);
      if (error.name === 'ValidationError') error = this.handleValidationErrorDB(error);
      if (error.name === 'ExecutionError') error = this.handleAcquireLocKError(error);
      if (error.code === 11000) error = this.handleDuplicateDB(error);
      if (error.name === 'JsonWebTokenError') error = this.handleJWTError();
      if (error.name === 'TokenExpiredError') error = this.handleJWTExpiredError();
      if (error instanceof SyntaxError && 'body' in error) error = this.handleBadJsonFormatError();

      this.sendError(error, res);
    };
  }
}
