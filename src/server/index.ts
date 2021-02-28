import { DEFAULT_CONFIG } from "../config";
import { Cahum } from "../game/cahum";
import { startSocketIO } from "./socketio";

export const start = () => {
  console.log("starting server...");

  const io = startSocketIO(DEFAULT_CONFIG);

  const game = new Cahum();
  const namespace = io.of("cahum");

  // put everyone that connects to the cahum namespace in the same game
  namespace.on("connection", game.handleSocket);
};
