import { DEFAULT_CONFIG } from "../config";
import { lobbySocketHandler } from "../service/lobby";
import { startExpress } from "./express";
import { startSocketIO } from "./socketio";

export const start = async () => {
  console.log("---- Server starting ----");

  const http = await startExpress(DEFAULT_CONFIG);
  const io = startSocketIO(http, DEFAULT_CONFIG);

  /*
  const debugGame = createGame<Cahum, CahumCreateSettings>(Cahum, CAHUM_OPTS);
  const gameNamespace = io.of("cahum");
  gameNamespace.on("connection", debugGame.handleSocket);
  */

  const lobby = io.of("lobby");
  lobby.on("connection", lobbySocketHandler);
};
