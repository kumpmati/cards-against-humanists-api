const {
  status,
  getTimer,
  setTimer,
  clearTimer,
  setGameStatus,
} = require("../../state/util");

/*
 * Tick function for the CZAR_CHOOSES_WINNER game state
 */
module.exports = (room) => {
  // set timer if not set already
  if (!getTimer(room)) setTimer(room, 10);
  const timer = getTimer(room);

  // if timer has ended, move to the next round and remove timer
  if (timer - new Date() <= 0) {
    clearTimer(room);
    setGameStatus(room, status.gameLoop);
    return room;
  }

  // do nothing until timer has ended
  return null;
};
