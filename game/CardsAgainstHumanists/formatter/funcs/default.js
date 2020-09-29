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

  const formattedData = {
    game_status: getGameStatus(room),

    // get current timer
    timer_end_date: getTimer(room),

    // get the name of the czar if czar is defined
    current_czar: czar ? czar.name : null,

    current_question: getCurrentQuestion(room),

    submitted_cards: getAllSubmittedCards(room),

    // Get cards in hand for the current player
    cards: getPlayerCards(room, sid) || [],

    // only show player names and scores
    players: players.map((player) => ({
      name: player.name,
      score: getPlayerScore(room, player.sid),
    })),
  };

  return formattedData;
};

module.exports = defaultFormatterFunc;
