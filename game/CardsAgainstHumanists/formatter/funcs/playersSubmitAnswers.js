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
  getHost
} = require("../../state/util");

const { shortSid } = require("../util");

/*
 * Formatter function for the PLAYERS_SUBMIT_ANSWERS state
 */
const defaultFormatterFunc = (room, sid) => {
  // get array of players and their SIDs
  const players = getPlayers(room);

  // get the current czar as a player object
  const czar = getPlayer(room, getCurrentCzar(room));

  // get all submitted cards and remove the text
  const submittedCards = getAllSubmittedCards(room).map((sub) =>
    sub.map((c) => ({ text: "", id: c.id }))
  );

  /*
   * Formatted data
   */
  const formattedData = {
    // only show player names and scores
    players: players.map((player) => ({
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
      // strip cards of text
      submitted_cards: submittedCards,
      cards: getPlayerCards(room, sid) || [],
    },
  };

  return formattedData;
};

module.exports = defaultFormatterFunc;
