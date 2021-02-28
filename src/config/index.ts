import { config as env } from "dotenv";
import { Config } from "./config";

env(); // load environment variables

export const DEFAULT_CONFIG: Config = {
  dev: process.env.ENV === "development",
  port: +process.env.PORT || 9000,
};
