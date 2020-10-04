const {
  status,
  setGameStatus,
  getTimer,
  setTimer,
  clearTimer,
} = require("../../state/util");

/*
 * Tick function for the SHOW_WINNER game state
 */
module.exports = room => {
  // set timer for 5 seconds
  if (!getTimer(room)) setTimer(room, 4);

  const timerHasEnded = getTimer(room) - new Date() <= 0;

  // move to next round when timer has ended
  if (timerHasEnded) {
    clearTimer(room);
    setGameStatus(room, status.gameLoop);
    return room;
  }

  return null;
};
