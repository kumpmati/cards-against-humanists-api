// game states
const { status } = require("../../state/util");

/*
 * Evaluator functions
 */
const noAction = () => null; // nothing is done to the room
const playersSubmitAnwsersFunc = require("./playersSubmitAnswers");
const czarChoosesWinnerFunc = require("./czarChoosesWinner");
const waitingForPlayers = require("./waitingForPlayers");
/*
 * Match each game state with an evaluator function.
 * The keys are defined programmatically so that
 * the functions can be easily referenced using the game status:
 * e.g. evaluatorFuncs[status.gameLoop] => gameLoopFunc
 */
const evaluatorFuncs = {
  [status.waitingForPlayers]: waitingForPlayers,
  [status.startGame]: noAction,
  [status.gameLoop]: noAction,
  [status.playersSubmitAnwsers]: playersSubmitAnwsersFunc,
  [status.czarChoosesWinner]: czarChoosesWinnerFunc,
  [status.showWinner]: noAction,
  [status.endGame]: noAction,
};

module.exports = evaluatorFuncs;
