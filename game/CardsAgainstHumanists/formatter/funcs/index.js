const { status } = require("../../state/util");

/*
 * Formatter functions
 */
const defaultFormatterFunc = require("./default");
const playersSubmitAnswersFunc = require("./playersSubmitAnswers");

/*
 * Match each game state with an formatter function.
 * The keys are defined programmatically so that
 * the functions can be easily referenced using the game status:
 * e.g. formatterFuncs[status.gameLoop] => gameLoopFormatter
 */
const formatterFuncs = {
	default: defaultFormatterFunc,
	[status.playersSubmitAnwsers]: playersSubmitAnswersFunc,
};

module.exports = formatterFuncs;
