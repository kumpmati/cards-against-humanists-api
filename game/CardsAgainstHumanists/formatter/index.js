const { getName } = require("./util");
const {
  getGameStatus,
  getCurrentQuestion,
  getPlayerCards,
  getCurrentCzar,
  getPlayerScore,
  getPlayers,
} = require("../state/util");

/*
 * Formatter removes and formats the room state for a single player so that
 * they can't see sensitive data about other players, such as their cards
 */
const formatter = (room, sid) => {
  // array of players, where each playes is in format: [sid, player]
  const players = getPlayers(room);

  const formattedState = {
    game_status: getGameStatus(room),

    // get the current czar's name
    current_czar: getName(getCurrentCzar(room)),

    // get the names of all players
    players: players.map(([sid, player]) => {
      return {
        name: getName(player),
        score: getPlayerScore(room, sid),
      };
    }),

    // get the current question card
    current_question: getCurrentQuestion(room),

    // get the player's in-hand cards as an array, default to an empty array
    cards: getPlayerCards(room, sid) || [],
  };

  return formattedState;
};

module.exports = formatter;
