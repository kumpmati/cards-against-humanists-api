const {
  getRequiredCards,
  getCurrentCzar,
  getPlayerCards,
  setPlayerCards,
  setSubmittedCards,
  getSubmittedCards,
} = require("../../state/util");

/*
 * Evaluator for the PLAYERS_SUBMIT_ANSWERS game state
 */
const playersSubmitAnswersFunc = (room, action) => {
  const { data, sid } = action;

  // prevent czar from doing anything
  if (sid == getCurrentCzar(room)) return null;

  const dataIsValid = !!data && !!data.submit;
  const playerHasSubmitted = getSubmittedCards(room, sid);
  const correctAmountOfCards =
    dataIsValid && data.submit.length === getRequiredCards(room);

  // reject submission if conditions are not met
  if (!dataIsValid || !correctAmountOfCards || playerHasSubmitted) return null;

  const cardsInHand = getPlayerCards(room, sid);
  const remainingCards = getPlayerCards(room, sid).filter(
    card => !data.submit.find(submittedCard => submittedCard.id === card.id)
  );

  const allCardsWereValid =
    cardsInHand.length - data.submit.length === remainingCards.length;
  if (!allCardsWereValid) return null;

  // update cards in hand and on table
  setPlayerCards(room, sid, remainingCards);
  setSubmittedCards(room, sid, data.submit);

  return room;
};

module.exports = playersSubmitAnswersFunc;
