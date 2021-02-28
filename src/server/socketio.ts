import { Server } from "socket.io";
import { Config } from "../config/config";

/**
 * Starts socket.io on the port specified in config
 * @param config Config
 */
export const startSocketIO = (config: Config): Server => {
  const io = new Server(config.port);
  console.log("socket.io started on port", config.port);
  return io;
};
