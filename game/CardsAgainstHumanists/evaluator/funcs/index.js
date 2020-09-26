// game states
const { status } = require("../../state/util");

/*
 * Evaluator functions
 */
const startGameFunc = require("./startGame");
const endGameFunc = require("./endGame");
const gameLoopFunc = require("./gameLoop");
const waitingForPlayersFunc = require("./waitingForPlayers");
const playersSubmitAnwsersFunc = require("./playersSubmitAnswers");
const czarChoosesWinnerFunc = require("./czarChoosesWinner");

/*
 * Match each game state with an evaluator function.
 * The keys are defined programmatically so that
 * the functions can be easily referenced using the game status:
 * e.g. evaluatorFuncs[status.gameLoop] => gameLoopFunc
 */
const evaluatorFuncs = {
  [status.startGame]: startGameFunc,
  [status.endGame]: endGameFunc,
  [status.gameLoop]: gameLoopFunc,
  [status.waitingForPlayers]: waitingForPlayersFunc,
  [status.playersSubmitAnwsers]: playersSubmitAnwsersFunc,
  [status.czarChoosesWinner]: czarChoosesWinnerFunc,
};

module.exports = evaluatorFuncs;
