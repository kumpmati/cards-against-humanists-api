const { getCurrentCzar } = require("../../state/util");

/*
 * Evaluator for the CZAR_CHOOSES_WINNER game state
 */
const czarChoosesWinnerFunc = (room, action) => {
  const { data, sid } = action;

  // only the czar is allowed to do anything
  if (sid != getCurrentCzar(room)) return null;

  // only allow czar to send selection commands
  if (!data || !data.select) return null;
};

module.exports = czarChoosesWinnerFunc;
