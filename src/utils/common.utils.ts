import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export class CommonUtils {
  static signToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h'
    });
  }

  static verifyJWTToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  static async verifyPassword(candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
}
