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
const getRequiredCards = (room) =>
  getCurrentQuestion(room) ? getCurrentQuestion(room).required_cards : 0;

/*
 * Player
 */
const getPlayers = (room) => Array.from(room.players.values());
const getPlayer = (room, sid) => room.players.get(sid);

const getPlayerCards = (room, sid) => room.state.player_cards.get(sid);
const setPlayerCards = (room, sid, value) =>
  room.state.player_cards.set(sid, value);

const getSubmittedCards = (room, sid) => room.state.submitted_cards.get(sid);
const setSubmittedCards = (room, sid, value) =>
  room.state.submitted_cards.set(sid, value);
const getAllSubmittedCards = (room) =>
  Array.from(room.state.submitted_cards.values());

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
 * Timer
 */
const getTimer = (room) => room.state.timer;
const setTimer = (room, seconds) => {
  const dt = new Date();
  dt.setSeconds(dt.getSeconds() + seconds);
  room.state.timer = dt;
};
const clearTimer = (room) => (room.state.timer = null);

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
  getRequiredCards,

  getSubmittedCards,
  getAllSubmittedCards,
  setSubmittedCards,

  getPlayer,
  getPlayers,
  setPlayerCards,
  getPlayerCards,
  setPlayerScore,
  getPlayerScore,

  setLastActiveTime,
  getLastActiveTime,

  getTimer,
  setTimer,
  clearTimer,
};
