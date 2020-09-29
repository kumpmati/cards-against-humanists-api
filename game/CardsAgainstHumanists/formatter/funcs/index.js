/*
 * Formatter functions
 */
const defaultFormatterFunc = require("./default");

/*
 * Match each game state with an formatter function.
 * The keys are defined programmatically so that
 * the functions can be easily referenced using the game status:
 * e.g. formatterFuncs[status.gameLoop] => gameLoopFormatter
 */
const formatterFuncs = {
  default: defaultFormatterFunc,
};

module.exports = formatterFuncs;
