import { PhaseConfig } from "boardgame.io";
import { startGame } from "./moves";

// Winner choosing phase
const waitForPlayers: PhaseConfig = {
  start: true,

  moves: {
    startGame,
  },

  turn: {},
  next: "play",
};

export default waitForPlayers;
