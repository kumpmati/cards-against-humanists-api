import { PhaseConfig } from "boardgame.io";
import { pickWinnerCard } from "../moves";

// Winner choosing phase
const waitForPlayers: PhaseConfig = {
  start: true,

  moves: {
    pickWinnerCard,
  },

  turn: {},
  next: "play",
};

export default waitForPlayers;
