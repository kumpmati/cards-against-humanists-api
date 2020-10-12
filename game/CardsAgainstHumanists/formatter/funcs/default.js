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
  getWinningCards,
  getCurrentCzar,
  getTimer,
  getHost,
} = require("../../state/util");

const { shortSid } = require("../util");

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
    players: players.map(player => ({
      name: player.name,
      id: shortSid(player.sid),
      score: getPlayerScore(room, player.sid),
    })),

    game: {
      game_status: getGameStatus(room),
      timer_end_date: getTimer(room),
      current_czar: czar ? shortSid(czar.sid) : null,
      host: shortSid(getHost(room)),
    },

    table: {
      current_question: getCurrentQuestion(room),
      submitted_cards: getAllSubmittedCards(room),
      cards: getPlayerCards(room, sid) || [],
      winning_cards: getWinningCards(room),
    },
  };

  return formattedData;
};

module.exports = defaultFormatterFunc;
