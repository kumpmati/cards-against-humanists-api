const {
  status,
  getTimer,
  setTimer,
  clearTimer,
  setGameStatus,
  getAllSubmittedCards,
} = require("../../state/util");

/*
 * Tick function for the CZAR_CHOOSES_WINNER game state
 */
module.exports = room => {
  // set timer if not set already
  if (!getTimer(room)) {
    setTimer(room, 60);
    return room;
  }

  /*
   * Skip if nobody submitted anything
   */
  const noSubmissions = getAllSubmittedCards(room).length == 0;
  const timerHasEnded = getTimer(room) - new Date() <= 0;

  // if timer has ended, move to the next round and disable timer
  if (timerHasEnded || noSubmissions) {
    clearTimer(room);
    setGameStatus(room, status.gameLoop);
    return room;
  }

  return null;
};
