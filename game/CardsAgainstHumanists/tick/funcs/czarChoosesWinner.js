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
  const { czarTime } = room.room_options;
  // set timer if not set already
  if (!getTimer(room) && czarTime !== -1) {
    setTimer(room, czarTime || 60); // default to 60s
    return room;
  }

  // Skip if nobody submitted anything
  const noSubmissions = getAllSubmittedCards(room).length == 0;
  const timerHasEnded = getTimer(room) && getTimer(room) - new Date() <= 0;

  // if timer has ended, move to the next round and disable timer
  if (timerHasEnded || noSubmissions) {
    clearTimer(room);
    setGameStatus(room, status.gameLoop);
    return room;
  }

  return null;
};
