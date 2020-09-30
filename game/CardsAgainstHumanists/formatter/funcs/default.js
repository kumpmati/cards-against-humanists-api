/*
 * State utilities
 */
const {
	getPlayer,
	getPlayers,
	getPlayerScore,
	getPlayerCards,
	getGameStatus,
	getCurrentQuestion,
	getAllSubmittedCards,
	getCurrentCzar,
	getTimer,
} = require("../../state/util");

/*
 * Default formatter function
 */
const defaultFormatterFunc = (room, sid) => {
	// get array of players and their SIDs
	const players = getPlayers(room);

	// get the current czar as a player object
	const czar = getPlayer(room, getCurrentCzar(room));

	/*
	 * Formatted data
	 */
	const formattedData = {
		// only show player names and scores
		players: players.map((player) => ({
			name: player.name,
			score: getPlayerScore(room, player.sid),
		})),

		game: {
			game_status: getGameStatus(room),
			timer_end_date: getTimer(room),
			current_czar: czar ? czar.name : null,
		},

		table: {
			current_question: getCurrentQuestion(room),
			submitted_cards: getAllSubmittedCards(room),
			cards: getPlayerCards(room, sid) || [],
		},
	};

	return formattedData;
};

module.exports = defaultFormatterFunc;
