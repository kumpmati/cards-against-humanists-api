/*
 * Evaluator for the WAITING_FOR_PLAYERS game state
 */
module.exports = (room, action) => {
  // players cannot do anything while waiting for other players
  return null;
};
