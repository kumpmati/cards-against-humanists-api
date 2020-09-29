const {
  setTimer,
  getTimer,
  setGameStatus,
  status,
  clearTimer,
} = require("../../state/util");

/*
 * Tick function for the PLAYERS_SUBMIT_ANSWERS game state
 */
module.exports = (room) => {
  // set timer if not already set
  if (!getTimer(room)) setTimer(room, 10);
  const timer = getTimer(room);

  // if timer has ended, move to winner choosing state and remove timer
  if (timer - new Date() <= 0) {
    clearTimer(room);
    setGameStatus(room, status.czarChoosesWinner);
    return room;
  }

  // do nothing until timer has ended
  return null;
};
