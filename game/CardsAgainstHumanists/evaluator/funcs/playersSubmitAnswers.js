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

	/*
	 * Necessary conditions for submission
	 */
	const dataIsValid = data && data.submit;
	const playerHasSubmitted = getSubmittedCards(room, sid);
	const correctAmountOfCards =
		dataIsValid && data.submit.length === getRequiredCards(room);

	// return if any condition is not met
	if (!dataIsValid || !correctAmountOfCards || playerHasSubmitted) return null;

	//get cards in hand
	const cardsInHand = getPlayerCards(room, sid);

	// remove submitted cards from hand
	const remainingCards = getPlayerCards(room, sid).filter(
		(card) => !data.submit.find((submittedCard) => submittedCard.id === card.id)
	);

	// return early if not all cards were valid
	if (cardsInHand.length - data.submit.length !== remainingCards.length) {
		return null;
	}

	// remove cards from player and transfer them to submitted cards
	setPlayerCards(room, sid, remainingCards);
	setSubmittedCards(room, sid, data.submit);

	return room;
};

module.exports = playersSubmitAnswersFunc;
