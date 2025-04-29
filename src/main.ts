import "dotenv/config";
import "reflect-metadata";
import { container } from "tsyringe";
import { App } from "./app";
import { MongoDBConnection } from "./configs/database/database.config";

const app = container.resolve(App);
const mongoDbConnection = container.resolve(MongoDBConnection);

mongoDbConnection
  .setUri(process.env.MONGO_URI as string)
  .connect()
  .then(() => {
    console.log("Database connected");
    app.start();
  })
  .catch((error: any) => {
    console.log(`Database connection failed; error: ${error.message}`);
  });
