import { v4 } from "uuid";
import { DEFAULT_CONFIG } from "../config";
import { Cahum } from "../game/cahum";
import { startExpress } from "./express";
import { startSocketIO } from "./socketio";

export const start = async () => {
  console.log("---- Server starting ----");

  const http = await startExpress(DEFAULT_CONFIG);
  const io = startSocketIO(http, DEFAULT_CONFIG);

  const gameID = v4().substr(0, 4);
  const game = new Cahum(gameID);

  // put everyone that connects to the cahum namespace in the same game.
  // NOTE: THIS WILL CHANGE.
  const namespace = io.of("cahum");
  namespace.on("connection", game.handleSocket);
};
