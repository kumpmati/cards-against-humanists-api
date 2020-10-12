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
  const timer = getTimer(room);

  // set timer if not already set
  if (!timer) {
    setTimer(room, 5);
    return room;
  }

  const timerHasEnded = timer - new Date() <= 0;
  if (!timerHasEnded) return null;

  clearTimer(room);
  setGameStatus(room, status.gameLoop);
  return room;
};
