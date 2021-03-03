import { DEFAULT_CONFIG } from "../config";
import { createGame } from "../game";
import { Cahum, CahumCreateSettings } from "../game/cahum";
import { startExpress } from "./express";
import { startSocketIO } from "./socketio";

const CAHUM_OPTS: CahumCreateSettings = {
  password: "",
  cardPacks: [],
  shuffleAnswers: false,
  czarReveals: false,
};

export const start = async () => {
  console.log("---- Server starting ----");

  const http = await startExpress(DEFAULT_CONFIG);
  const io = startSocketIO(http, DEFAULT_CONFIG);

  // DEBUG game
  const debugGame = createGame<Cahum, CahumCreateSettings>(Cahum, CAHUM_OPTS);

  // TODO: CHANGE THIS.
  // Put everyone that connects to the cahum namespace in the same game.
  // In the future this should be done after authentication.
  const namespace = io.of("cahum");
  namespace.on("connection", debugGame.handleSocket);
};
