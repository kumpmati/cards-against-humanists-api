/*
 * Evaluator for the END_GAME game state
 */
const endGameFunc = (room, action) => {
  // players cannot do anything while the game is ending
  return null;
};

module.exports = endGameFunc;
