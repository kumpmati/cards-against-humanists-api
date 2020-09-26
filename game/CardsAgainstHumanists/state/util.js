/**
 * Utility functions for handling the game data
 */

/*
 * Game status
 */
const setGameStatus = (room, status) => (room.state.game_status = status);
const getGameStatus = (room) => room.state.game_status;
const status = {
  waitingForPlayers: "WAITING_FOR_PLAYERS",
  startGame: "START_GAME",
  endGame: "END_GAME",
  gameLoop: "GAME_LOOP",
  playersSubmitAnwsers: "PLAYERS_SUBMIT_ANSWERS",
  czarChoosesWinner: "CZAR_CHOOSES_WINNER",
};

/*
 * Table
 */
const setCurrentQuestion = (room, card) => (room.state.current_question = card);
const getCurrentQuestion = (room) => room.state.current_question;

/*
 * Player
 */
const getPlayers = (room) => Array.from(room.players);

const getPlayerCards = (room, sid) => room.state.player_cards.get(sid);
const setPlayerCards = (room, sid, value) =>
  room.state.player_cards.set(sid, value);

const getPlayerScore = (room, sid) => room.state.player_scores.get(sid);
const setPlayerScore = (room, sid, value) =>
  room.state.player_scores.set(sid, value);

/*
 * Czar
 */
const setCurrentCzar = (room, sid) => (room.state.current_czar = sid);
const getCurrentCzar = (room) => room.state.current_czar;

/*
 * Room activity
 */
const getLastActiveTime = (room) => room.state.last_time_active;
const setLastActiveTime = (room) => (room.state.last_time_active = new Date());

/*
 * Exports
 */
module.exports = {
  setCurrentCzar,
  getCurrentCzar,

  setGameStatus,
  getGameStatus,
  status,

  setCurrentQuestion,
  getCurrentQuestion,

  getPlayers,
  setPlayerCards,
  getPlayerCards,
  setPlayerScore,
  getPlayerScore,

  setLastActiveTime,
  getLastActiveTime,
};
