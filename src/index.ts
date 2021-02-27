import { config } from "dotenv";
import { start } from "./server";

config(); // load environment variables
start(process.env.ENV === "development");
