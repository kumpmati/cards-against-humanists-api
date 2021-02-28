import { DEFAULT_CONFIG } from "../config";
import { startSocketIO } from "./socketio";

/**
 * Starts the server
 */
export const start = () => {
  console.log("starting server...");

  startSocketIO(DEFAULT_CONFIG);
};
