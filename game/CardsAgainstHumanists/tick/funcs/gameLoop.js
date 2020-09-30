const { v4: uuidv4 } = require("uuid");

const {
	status,
	setGameStatus,
	setCurrentQuestion,
	getPlayers,
	setPlayerCards,
	clearSubmittedCards,
	getPlayerScore,
	setPlayerScore,
	getCurrentCzar,
	setCurrentCzar,
} = require("../../state/util");

/*
 * Tick function for the GAME_LOOP game state
 */
module.exports = (room) => {
	// put a question card on the table
	// get one question card from server
	const [question] = room.getCards(true, 1);
	setCurrentQuestion(room, question);

	// remove any submitted cards
	clearSubmittedCards(room);

	// loop through players
	getPlayers(room).forEach(({ sid }) => {
		// give all players 4 cards
		setPlayerCards(room, sid, room.getCards(false, 4));

		// set score to 0 if it doesn't exist
		if (!getPlayerScore(room, sid)) setPlayerScore(room, sid, 0);
	});

	// get index of current czar
	const czarSid = getCurrentCzar(room);

	// find index of current czar
	const players = getPlayers(room);
	const czarIndex = players.findIndex((p) => p.sid === czarSid);
	const nextCzar = players[(czarIndex + 1) % players.length].sid;
	setCurrentCzar(room, nextCzar);

	// go to player submission state
	setGameStatus(room, status.playersSubmitAnwsers);
	return room;
};
