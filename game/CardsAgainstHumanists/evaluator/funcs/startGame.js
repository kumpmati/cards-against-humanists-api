/*
 * Evaluator for the START_GAME game state
 */
const startGameFunc = (room, action) => {
  // players cannot do anything while the game is starting
  return null;
};

module.exports = startGameFunc;
