import { PhaseConfig } from "boardgame.io";
import { chooseWinner, submitAnswer } from "./moves";

/**
 * Phase where the actual gameplay happens
 */
const play: PhaseConfig = {
  turn: {
    stages: {
      // players other than the Czar submit their answers
      chooseCard: {
        moves: {
          submitAnswer,
        },
      },

      // Czar picks the winner
      pickWinner: {
        moves: {
          chooseWinner,
        },
      },

      // Czar waits for the other players to choose their cards
      waitForOthers: {
        moves: {},
      },

      // players wait for the Czar to pick the winner
      waitForCzar: {
        moves: {},
      },
    },
  },
};

export default play;
