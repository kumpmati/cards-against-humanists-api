import { Ctx, PhaseConfig } from "boardgame.io";
import { CARDS_IN_HAND } from "../..";
import { DB } from "../../../db";
import { CahumG } from "../../types";
import { chooseWinner, submitAnswer } from "./moves";

export enum PlayStages {
  chooseCard = "chooseCard",
  pickWinner = "pickWinner",
  waitForOthers = "waitForOthers",
  waitForCzar = "waitForCzar",
}

/**
 * Function called on the beginning of every round of play
 * @param G
 * @param ctx
 */
const onRoundBegin = (G: CahumG, ctx: Ctx) => {
  // move players to stages
  ctx.events.setActivePlayers({
    currentPlayer: PlayStages.waitForOthers,
    others: PlayStages.chooseCard,
    moveLimit: 1,
  });

  G.table = {}; // reset table

  // give all players their cards
  // TODO: adjustable amount of cards
  for (let i = 0; i < ctx.numPlayers; i++) {
    if (!G.hands[i]) G.hands[i] = [];

    const numCardsMissing = CARDS_IN_HAND - G.hands[i].length;
    const newCards = DB.getAnswerCards(numCardsMissing, G.packs);

    G.hands[i].push(...newCards);
  }
};

/**
 * Phase where the actual gameplay happens
 */
const play: PhaseConfig<CahumG> = {
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
