import { DEFAULT_CONFIG } from "../config";
import { startLobbyService } from "../service/lobby";
import { startExpress } from "./express";
import { startSocketIO } from "./socketio";

export const start = async () => {
  console.log("---- Server starting ----");

  if (DEFAULT_CONFIG.dev) console.warn("DEVELOPMENT MODE\n");

  const http = await startExpress(DEFAULT_CONFIG);
  const io = startSocketIO(http, DEFAULT_CONFIG);

  startLobbyService(io);
};
