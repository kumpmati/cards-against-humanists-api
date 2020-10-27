/**
 * Utility functions for handling the game data
 *
 *
 */

/*
 * Game status
 */
const setGameStatus = (room, status) => (room.state.game_status = status);
const getGameStatus = room => room.state.game_status;
const status = {
  waitingForPlayers: "WAITING_FOR_PLAYERS",
  startGame: "START_GAME",
  endGame: "END_GAME",
  gameLoop: "GAME_LOOP",
  playersSubmitAnwsers: "PLAYERS_SUBMIT_ANSWERS",
  czarChoosesWinner: "CZAR_CHOOSES_WINNER",
  showWinner: "SHOW_WINNER",
};

/*
 * Table
 */
const setCurrentQuestion = (room, card) => (room.state.current_question = card);
const getCurrentQuestion = room => room.state.current_question;
const getRequiredCards = room =>
  getCurrentQuestion(room) ? getCurrentQuestion(room).required_cards : 0;

/*
 * Owner
 */
const getHost = room => room.host;
const setHost = (room, sid) => (room.host = sid.slice(0, 4));

/*
 * Player
 */
const getPlayers = room => Array.from(room.players.values());
const getPlayer = (room, sid) => room.players.get(sid);

const getPlayerCards = (room, sid) => room.state.player_cards.get(sid);
const setPlayerCards = (room, sid, value) =>
  room.state.player_cards.set(sid, value);

/*
 * Score
 */
const getPlayerScore = (room, sid) => room.state.player_scores.get(sid);
const setPlayerScore = (room, sid, value) =>
  room.state.player_scores.set(sid, value);

/*
 * Submitted cards
 */
const getSubmittedCards = (room, sid) => room.state.submitted_cards.get(sid);
const clearSubmittedCards = room => room.state.submitted_cards.clear();

const setSubmittedCards = (room, sid, value) =>
  room.state.submitted_cards.set(sid, value);

const getAllSubmittedCards = room =>
  Array.from(room.state.submitted_cards.values());

const getAllSubmissions = room =>
  Array.from(room.state.submitted_cards.entries());

/*
 * Winning cards
 */
const getWinningCards = room => room.state.winning_cards;
const setWinningCards = (room, ids) => (room.state.winning_cards = ids);
const clearWinningCards = room => (room.state.winning_cards = null);

/*
 * Cards
 */
const getAnswerCard = room => {
  const arr = room.state.cards.answers;
  const i = ~~(Math.random() * arr.length - 1);
  const [card] = arr.splice(i, 1);
  room.state.used_cards.answers.push(card);
  return card;
};

const getQuestionCard = room => {
  const arr = room.state.cards.questions;
  const i = ~~(Math.random() * arr.length - 1);
  const [card] = arr.splice(i, 1);
  room.state.used_cards.questions.push(card);
  return card;
};

const setAvailableCards = (room, cards) => (room.state.cards = cards);
const resetAvailableCards = room => {
  resetAvailableQuestionCards(room);
  resetAvailableAnswerCards(room);
};
const resetAvailableAnswerCards = room => {
  const { answers } = room.state.used_cards;
  room.state.cards.answers.push(...answers);
  room.state.used_cards.answers = [];
};
const resetAvailableQuestionCards = room => {
  const { questions } = room.state.used_cards;
  room.state.cards.questions.push(...questions);
  room.state.used_cards.questions = [];
};

/*
 * Czar
 */
const setCurrentCzar = (room, sid) => (room.state.current_czar = sid);
const getCurrentCzar = room => room.state.current_czar;

/*
 * Room activity
 */
const getLastActiveTime = room => room.state.last_time_active;
const setLastActiveTime = room => (room.state.last_time_active = new Date());
const increaseRound = room => room.state.round++;

/*
 * Timer
 */
const getTimer = room => room.state.timer;
const setTimer = (room, seconds) => {
  const dt = new Date();
  dt.setSeconds(dt.getSeconds() + seconds);
  room.state.timer = dt;
};
const clearTimer = room => (room.state.timer = null);

/*
 * Exports
 */
module.exports = {
  getHost,
  setHost,

  status,
  setGameStatus,
  getGameStatus,

  setCurrentCzar,
  getCurrentCzar,

  setCurrentQuestion,
  getCurrentQuestion,
  getRequiredCards,

  getWinningCards,
  setWinningCards,
  clearWinningCards,

  clearSubmittedCards,
  getSubmittedCards,
  getAllSubmittedCards,
  getAllSubmissions,
  setSubmittedCards,

  getQuestionCard,
  getAnswerCard,
  setAvailableCards,
  resetAvailableCards,
  resetAvailableAnswerCards,
  resetAvailableQuestionCards,

  getPlayer,
  getPlayers,
  setPlayerCards,
  getPlayerCards,
  setPlayerScore,
  getPlayerScore,

  setLastActiveTime,
  getLastActiveTime,
  increaseRound,

  getTimer,
  setTimer,
  clearTimer,
};
