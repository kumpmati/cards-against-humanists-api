import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { Config } from "../config/config";

const SOCKETIO_OPTS = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};

/**
 * Starts socket.io on the port specified in config
 * @param config Config
 */
export const startSocketIO = (http: HTTPServer, config: Config): Server => {
  console.log("starting socket.io");
  const io = new Server(http, SOCKETIO_OPTS);
  console.log("socket.io started on port", config.port);
  return io;
};
