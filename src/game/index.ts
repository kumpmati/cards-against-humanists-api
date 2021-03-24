import { Game } from "boardgame.io";

export const Cahum: Game = {
  name: "cahum",

  // Function that returns the initial value of G.
  // setupData is an optional custom object that is
  // passed through the Game Creation API.
  setup: (ctx, setupData) => {
    return { hello: "world" };
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

  // Function that allows you to tailor the game state to a specific player.
  playerView: (G, ctx, playerID) => {},

  // The seed used by the pseudo-random number generator.
  seed: "teekkarilakki",

  phases: {},

  // Disable undo feature for all the moves in the game
  disableUndo: true,
};

const isSetupData = (data: any): data is SetupData => typeof data === "object";

interface SetupData {}
