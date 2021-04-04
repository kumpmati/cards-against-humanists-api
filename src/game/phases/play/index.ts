import { Ctx, PhaseConfig } from "boardgame.io";
import { chooseWinner, submitAnswer } from "./moves";

export enum PlayStages {
  chooseCard = "chooseCard",
  pickWinner = "pickWinner",
  waitForOthers = "waitForOthers",
  waitForCzar = "waitForCzar",
}

const onRoundBegin = (G: any, ctx: Ctx) => {
  ctx.events.setActivePlayers({
    currentPlayer: PlayStages.waitForOthers,
    others: PlayStages.chooseCard,
    moveLimit: 1,
  });
};

/**
 * Phase where the actual gameplay happens
 */
const play: PhaseConfig = {
  turn: {
    onBegin: onRoundBegin,
    stages: {
      // players other than the Czar submit their answers
      [PlayStages.chooseCard]: {
        moves: {
          submitAnswer,
        },
      },

      // Czar waits for the other players to choose their cards
      [PlayStages.waitForOthers]: {
        moves: {},
      },

      // Czar picks the winner
      [PlayStages.pickWinner]: {
        moves: {
          chooseWinner,
        },
      },

      // players wait for the Czar to pick the winner
      [PlayStages.waitForCzar]: {
        moves: {},
      },
    },
  },
};

export default play;
