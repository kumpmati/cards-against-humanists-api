const {
  setSubmittedCards,
  setPlayerCards,
  getPlayerCards,
  getRequiredCards,
  getCurrentCzar,
} = require("../../state/util");

/*
 * Evaluator for the PLAYERS_SUBMIT_ANSWERS game state
 */
const playersSubmitAnswersFunc = (room, action) => {
  const { data, sid } = action;

  // prevent czar from doing anything
  if (sid == getCurrentCzar(room)) return null;

  // return early if player sent incorrect amount of cards, or if they sent none
  if (!data || !data.submit || data.submit.length != getRequiredCards(room))
    return null;

  return room;
};

module.exports = playersSubmitAnswersFunc;
