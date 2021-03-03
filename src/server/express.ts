import express from "express";
import cors from "cors";
import { Server as HTTPServer } from "http";
import { apiRoutes } from "../api";
import { Config } from "../config/config";

export const startExpress = async (config: Config): Promise<HTTPServer> => {
  return new Promise((resolve, reject) => {
    console.log("starting express");

    const app = express();
    app.use(cors()); // TODO: more strict CORS settings
    app.use(express.json());
    app.use("/api", apiRoutes);

    const http = new HTTPServer(app);
    http.listen(config.port, () => {
      console.log("express started on port", config.port);
      resolve(http);
    });

    setTimeout(() => reject("failed to start express within 60s"), 60 * 1000);
  });
};
