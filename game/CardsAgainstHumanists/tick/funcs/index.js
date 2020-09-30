const { status } = require("../../state/util");

const waitingForPlayersFunc = require("./waitingForPlayers");
const startGameFunc = require("./startGame");
const gameLoopFunc = require("./gameLoop");
const playersSubmitAnswersFunc = require("./playersSubmitAnswers");
const czarChoosesWinnerFunc = require("./czarChoosesWinner");
const showWinnerFunc = require("./showWinner");
const endGameFunc = require("./endGame");
/*
 * Match each game state with an tick function.
 * The keys are defined programmatically so that
 * the functions can be easily referenced using the game status:
 * e.g. tickFuncs[status.gameLoop] => gameLoopFunc
 */
const tickFuncs = {
	[status.waitingForPlayers]: waitingForPlayersFunc,
	[status.startGame]: startGameFunc,
	[status.gameLoop]: gameLoopFunc,
	[status.playersSubmitAnwsers]: playersSubmitAnswersFunc,
	[status.czarChoosesWinner]: czarChoosesWinnerFunc,
	[status.showWinner]: showWinnerFunc,
	[status.endGame]: endGameFunc,
};

module.exports = tickFuncs;
