import { Game } from "boardgame.io";
import { DB } from "../db";
import play from "./phases/play";
import waitForPlayers from "./phases/waitForPlayers";

/**
 * Cards Against Humanists
 */
export const Cahum: Game = {
  name: "cahum",

  // Function that returns the initial value of G.
  // setupData is an optional custom object that is
  // passed through the Game Creation API.
  setup: (ctx, setupData) => {
    return {
      table: [], // holds all submitted cards

      hands: {}, // hands of all players

      // not sent to clients
      serverOnly: {
        cards: DB.getCards(["Cahum"]),
      },
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
  },

  playerView: (G, ctx, playerID) => {
    const { serverOnly, ...toClient } = G; // remove server-only data from G

    return toClient;
  },

  // The seed used by the pseudo-random number generator.
  seed: "teekkarilakki",

  phases: {
    waitForPlayers,
    play,
  },

  disableUndo: true,
};

const isSetupData = (data: any): data is SetupData => typeof data === "object";

// TODO: more complicated setup data
interface SetupData {}
