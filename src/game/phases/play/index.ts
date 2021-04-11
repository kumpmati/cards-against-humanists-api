import { Ctx, PhaseConfig } from "boardgame.io";
import { NUM_CARDS } from "../..";
import { DB } from "../../../db";
import { shuffle } from "../../../util";
import {
  allCardsRevealed,
  getAnswers,
  getQuestions,
  isAtStage,
  numPlayersAtStage,
  setStage,
} from "../../../util/play";
import { AnswerCard, CahumG, QuestionCard } from "../../types";
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

  G.state.round++;
  setStage(G, PlayStages.submitAnswer);

  // reset table state
  G.table = {
    question: getQuestions(G, 1)?.[0],
    answers: [],
    revealed: [],
  };

  // give all players their cards
  // TODO: adjustable amount of cards
  for (let i = 0; i < ctx.numPlayers; i++) {
    if (!G.hands[i]) G.hands[i] = [];

    const numMissingCards = NUM_CARDS - G.hands[i].length;
    const answers = getAnswers(G, numMissingCards);

    G.hands[i].push(...answers);
  }
};

/**
 * Called after every move. Handles checking if all players have answered.
 * @param G
 * @param ctx
 */
const onMove = (G: CahumG, ctx: Ctx) => {
  const waitingForAnswers = numPlayersAtStage(ctx, PlayStages.submitAnswer) > 0;
  const inChoosingStage = numPlayersAtStage(ctx, PlayStages.chooseWinner) > 0;
  if (waitingForAnswers || inChoosingStage) return; // already choosing, do nothing

  // shuffle answers once
  if (G.settings.shuffleAnswers && isAtStage(G, PlayStages.submitAnswer)) {
    G.table.answers = shuffle(G.table.answers);
  }

  /**
   * Card revealing phase
   */
  if (G.settings.czarReveals && !allCardsRevealed(G)) {
    setStage(G, PlayStages.czarReveals);
    ctx.events.setActivePlayers({
      currentPlayer: PlayStages.czarReveals,
      others: PlayStages.waitForCzar,
    });
    return;
  }

  /**
   * Winner choosing phase
   */
  setStage(G, PlayStages.chooseWinner);
  ctx.events.setActivePlayers({
    currentPlayer: PlayStages.chooseWinner,
    others: PlayStages.waitForCzar,
  });
};

/**
 * Phase where the actual gameplay happens.
 */
const play: PhaseConfig<CahumG> = {
  turn: {
    onBegin,
    onMove,

    stages: {
      // players (not Czar) submit their answers
      [PlayStages.submitAnswer]: {
        moves: {
          submitAnswer: { move: submitAnswer, client: false },
        },
      },

      // Czar reveals answers one by one
      [PlayStages.czarReveals]: {
        moves: { revealCard: { move: revealCard, client: false } },
      },

      // Czar chooses who wins the round
      [PlayStages.chooseWinner]: {
        moves: { chooseWinner: { move: chooseWinner, client: false } },
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
