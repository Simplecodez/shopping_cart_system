import mongoose from "mongoose";
import { IDatabaseConnection } from "./database.interface";
import { singleton } from "tsyringe";

@singleton()
export class MongoDBConnection implements IDatabaseConnection {
  private uri: string;
  constructor() {}

  setUri(uri: string) {
    this.uri = uri;
    return this;
  }

  async connect(): Promise<void> {
    try {
      console.log("Connecting to database...");
      await mongoose.connect(this.uri);
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
}
