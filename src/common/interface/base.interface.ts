import { Document, Types } from 'mongoose';

export interface IBase {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
