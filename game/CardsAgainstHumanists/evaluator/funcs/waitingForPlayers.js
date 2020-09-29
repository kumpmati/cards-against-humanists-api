/*
 * Evaluator for the WAITING_FOR_PLAYERS game state
 */
const waitingForPlayersFunc = (room, action) => {
  // players cannot do anything while waiting for other players
  return null;
};

module.exports = waitingForPlayersFunc;
