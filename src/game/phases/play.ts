import { PhaseConfig } from "boardgame.io";
import { pickWinnerCard } from "../moves";

// Winner choosing phase
const play: PhaseConfig = {
  moves: {
    pickWinnerCard,
  },
  turn: {
    stages: {
      // stage where players other than the Czar choose their cards
      chooseCard: {
        moves: {
          chooseCard: () => {},
        },
      },

      // stage where Czar picks the winner
      pickWinner: {
        moves: {
          pickWinner: () => {},
        },
      },

      // stage where the Czar waits for the other players to choose their cards
      waitForOthers: {},

      // stage where the other players wait for the czar to pick the winner
      waitForCzar: {},
    },
  },
};

export default play;
