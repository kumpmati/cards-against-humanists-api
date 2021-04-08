import { Ctx, PhaseConfig } from "boardgame.io";
import { NUM_CARDS } from "../..";
import { DB } from "../../../db";
import { CahumG } from "../../types";
import { submitAnswer, chooseWinner, revealCard } from "./moves";

export enum PlayStages {
  submitAnswer = "submitAnswer",
  waitForAnswers = "waitForAnswers",

  czarReveals = "czarReveals",

  waitForCzar = "waitForCzar",
  chooseWinner = "chooseWinner",
}

/**
 * Function called on the beginning of every round of play
 * @param G
 * @param ctx
 */
const onBegin = (G: CahumG, ctx: Ctx) => {
  // mark every player as an active player so that the turn doesn't end automatically
  ctx.events.setActivePlayers({
    currentPlayer: PlayStages.waitForAnswers, // czar waits for answers from players
    others: { stage: PlayStages.submitAnswer, moveLimit: 1 }, // players submit answers
  });

  G.currentStage = PlayStages.submitAnswer;

  // reset table state
  G.table = {
    question: DB.getQuestionCards(1, G.settings.packs)[0], // random question from DB
    answers: [],
    revealed: [],
  };

  // give all players their cards
  // TODO: adjustable amount of cards
  for (let i = 0; i < ctx.numPlayers; i++) {
    if (!G.hands[i]) G.hands[i] = [];

    const numCardsMissing = NUM_CARDS - G.hands[i].length;
    const newCards = DB.getAnswerCards(numCardsMissing, G.settings.packs);

    G.hands[i].push(...newCards);
  }
};

/**
 * Helper function to calculate number of active players that are currently in the given stage
 * @param ctx Ctx
 * @param stage Stage name
 * @returns Number of players in that stage
 */
const numPlayersAtStage = (ctx: Ctx, stage: string): number =>
  Object.values(ctx?.activePlayers || {}).filter((p) => p === stage).length;

/**
 * Called after every move. Handles checking if all players have answered.
 * @param G
 * @param ctx
 */
const onMove = (G: CahumG, ctx: Ctx) => {
  const waitingForAnswers = numPlayersAtStage(ctx, PlayStages.submitAnswer) > 0;
  if (waitingForAnswers) return; // waiting for players, do nothing

  const inChoosingStage = numPlayersAtStage(ctx, PlayStages.chooseWinner) > 0;
  if (inChoosingStage) return; // already choosing, do nothing

  const allCardsRevealed =
    G.table.answers.length > 0 &&
    G.table.answers.length === G.table.revealed.length;

  if (G.settings.czarReveals && !allCardsRevealed) {
    // all cards must be revealed before choosing a winner
    G.currentStage = PlayStages.czarReveals;
    ctx.events.setActivePlayers({
      currentPlayer: PlayStages.czarReveals,
      others: PlayStages.waitForCzar,
    });
    return;
  }

  G.currentStage = PlayStages.chooseWinner;
  ctx.events.setActivePlayers({
    currentPlayer: PlayStages.chooseWinner,
    others: PlayStages.waitForCzar,
  });
};

/**
 * Phase where the actual gameplay happens
 */
const play: PhaseConfig<CahumG> = {
  turn: {
    onBegin,
    onMove,

    stages: {
      // players (not Czar) submit their answers
      [PlayStages.submitAnswer]: {
        moves: {
          submitAnswer,
        },
      },

      // Czar reveals answers one by one
      [PlayStages.czarReveals]: {
        moves: {
          revealCard,
        },
      },

      // Czar chooses who wins the round
      [PlayStages.chooseWinner]: {
        moves: {
          chooseWinner,
        },
      },

      // cannot do anything while waiting
      [PlayStages.waitForAnswers]: {
        moves: {},
      },

      // cannot do anything while waiting
      [PlayStages.waitForCzar]: {
        moves: {},
      },
    },
  },
};

export default play;
