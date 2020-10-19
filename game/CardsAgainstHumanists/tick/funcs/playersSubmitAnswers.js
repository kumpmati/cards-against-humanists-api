const {
  status,
  setTimer,
  getTimer,
  setGameStatus,
  clearTimer,
  getAllSubmittedCards,
  getPlayers,
} = require("../../state/util");

/*
 * Tick function for the PLAYERS_SUBMIT_ANSWERS game state
 */
module.exports = room => {
  const timer = getTimer(room);
  // set timer if not set already
  if (!timer) {
    const { answerTime } = room.room_options;
    setTimer(room, answerTime || 60); // default to 60s
    return room;
  }

  const submittedCards = getAllSubmittedCards(room);
  const players = getPlayers(room);

  /*
   * Conditions to check before moving to next state
   */
  const allCardsAreSubmitted = submittedCards.length >= players.length - 1; // exclude the czar from submission amount
  const timerHasEnded = timer - new Date() <= 0;

  // move to next state if conditions are met
  if (timerHasEnded || allCardsAreSubmitted) {
    // remove timer
    clearTimer(room);
    setGameStatus(room, status.czarChoosesWinner);
    return room;
  }

  // do nothing until timer has ended
  return null;
};
