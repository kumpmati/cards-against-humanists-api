const { status } = require("./util");

// initial state of the game when the room is created.
// it's a function so that each returned state is a new object
const initialState = () => ({
  // the status of the game
  // start the game by waiting for players
  game_status: status.waitingForPlayers,

  // the session id of the current czar
  current_czar: null,

  // current_question has to be an object containing two fields:
  // "text" and "required_cards", where "text" is the text shown to the players,
  // and "required_cards" is the number of cards required by the question
  current_question: null,

  // each player's current cards stored as the value, player's session id is the key
  player_cards: new Map(),

  // each player's current points stored as the value, player's session id is the key
  player_scores: new Map(),

  // each player's submitted cards stored as the value, player's session id as the key
  // when a player submits their card(s), the card(s) will be removed from player_cards
  // and added to this map
  submitted_cards: new Map(),

  // timestamp of the last time a player was in the room
  last_time_active: new Date(),

  // timer
  timer: null,
});

module.exports = initialState;
