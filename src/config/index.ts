import { config as env } from "dotenv";
import { Config } from "./config";
import { ServiceAccount } from "firebase-admin";

env(); // load environment variables

export const DEFAULT_CONFIG: Config = {
  dev: process.env.ENV
    ? process.env.ENV === "development"
    : process.env.NODE_ENV === "development",
  port: parseInt(process.env.PORT) || 9000,
  db: process.env.DB_NAME,
  firebase: JSON.parse(process.env.FB_CREDENTIALS) as ServiceAccount,
};
