import { Game } from "boardgame.io";
import play from "./phases/play";
import { playPlayerView } from "./phases/play/playerView";
import { validateSetupData } from "./setup";
import waitForPlayers from "./phases/waitForPlayers";
import { CahumG, SetupData } from "./types";
import { v4 } from "uuid";

export const NUM_CARDS = 7;

/**
 * SERVER SIDE
 */
export const Cahum: Game<CahumG> = {
  name: "cahum",

  // Function that returns the initial value of G.
  // setupData is an optional custom object that is
  // passed through the Game Creation API.
  setup: (ctx, setupData: SetupData): CahumG => {
    return {
      table: {
        question: null,
        answers: [],
        revealed: [],
      }, // all submitted cards with playerNum as key
      state: {
        round: 0,
        stage: null,
      },
      points: {},
      hands: {},
      settings: setupData,
      deck: {
        answerDeckIndex: 0,
        questionDeckIndex: 0,
        seed: v4(), // used when shuffling cards from DB
      },
    };
  },

  validateSetupData,
  playerView: playPlayerView,

  // The seed used by the pseudo-random number generator.
  seed: "teekkarilakki",

  phases: {
    waitForPlayers,
    play,
  },

  disableUndo: true,
};
