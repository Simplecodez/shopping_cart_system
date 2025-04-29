import mongoose, { Schema, Document, Model } from 'mongoose';

export default interface IModel<T> {
  model: Model<T>;
}
