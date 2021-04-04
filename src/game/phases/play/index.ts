import { PhaseConfig } from "boardgame.io";
import { chooseWinner, submitAnswer } from "./moves";

export enum PlayStages {
  chooseCard = "chooseCard",
  pickWinner = "pickWinner",
  waitForOthers = "waitForOthers",
  waitForCzar = "waitForCzar",
}

/**
 * Phase where the actual gameplay happens
 */
const play: PhaseConfig = {
  turn: {
    stages: {
      // players other than the Czar submit their answers
      [PlayStages.chooseCard]: {
        moves: {
          submitAnswer,
        },
      },

      // Czar picks the winner
      [PlayStages.pickWinner]: {
        moves: {
          chooseWinner,
        },
      },

      // Czar waits for the other players to choose their cards
      [PlayStages.waitForOthers]: {
        moves: {},
      },

      // players wait for the Czar to pick the winner
      [PlayStages.waitForCzar]: {
        moves: {},
      },
    },
  },
};

export default play;
