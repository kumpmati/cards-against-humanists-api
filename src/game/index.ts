import { Game } from "boardgame.io";
import { DB } from "../db";
import play from "./phases/play";
import waitForPlayers from "./phases/waitForPlayers";
import { CahumG, SetupData } from "./types";

export const CARDS_IN_HAND = 7;

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
      table: {}, // all submitted cards with playerNum as key
      hands: {}, // hands of all players with playerNum as key
      packs: setupData.packs,
    };
  },

  // Optional function to validate the setupData before
  // matches are created. If this returns a value,
  // an error will be reported to the user and match
  // creation is aborted.
  validateSetupData: (setupData, numPlayers) => {
    if (!isSetupData(setupData)) return "Setup data is malformed";

    if (numPlayers < 2 || numPlayers > 100)
      return "Number of players must be 2 <= x <= 100";

    try {
      DB.getCards(setupData.packs); // check that all card packs are valid
    } catch (e) {
      return e.message;
    }
  },

  // playerView: (G, ctx, playerID) => {},

  // The seed used by the pseudo-random number generator.
  seed: "teekkarilakki",

  phases: {
    waitForPlayers,
    play,
  },

  disableUndo: true,
};

// type guard for SetupData
const isSetupData = (data: any): data is SetupData =>
  typeof data === "object" &&
  data.hasOwnProperty("packs") &&
  Array.isArray(data.packs) &&
  data.hasOwnProperty("maxPlayers") &&
  typeof data.maxPlayers === "number" &&
  data.hasOwnProperty("shuffleAnswers") &&
  typeof data.shuffleAnswers === "boolean" &&
  data.hasOwnProperty("czarReveals") &&
  typeof data.czarReveals === "boolean";
