const {
  status,
  setGameStatus,
  setCurrentQuestion,
  getPlayers,
  setPlayerCards,
  clearSubmittedCards,
  clearWinningCards,
  getPlayerScore,
  setPlayerScore,
  getCurrentCzar,
  setCurrentCzar,
  getPlayerCards,
  getAnswerCard,
  getQuestionCard,
  resetAvailableQuestionCards,
  resetAvailableAnswerCards,
  increaseRound,
} = require("../../state/util");
const { v4: uuid } = require("uuid");
const endGame = require("./endGame");

/*
 * Tick function for the GAME_LOOP game state
 */
module.exports = async room => {
  increaseRound(room);
  console.log(room.state.round)
  if(room.state.round > 10) setGameStatus(room, status.endGame);
  // get one question card from server
  let question = getQuestionCard(room);
  if (!question) {
    resetAvailableQuestionCards(room);
    question = getQuestionCard(room);
  }
  setCurrentQuestion(room, question);

  clearWinningCards(room);
  clearSubmittedCards(room);

  const players = getPlayers(room);
  // pause game if not enough players
  if (players.length < 2) {
    setGameStatus(room, status.waitingForPlayers);
    return room;
  }

  // number of cards each player should have after each round
  const { cardsInHand } = room.room_options;

  players.forEach(({ sid }) => {
    const playerCards = getPlayerCards(room, sid) || [];
    const newCards = [];

    // maintain number of cards defined in options but default to 7 cards
    const neededCardsNum = (cardsInHand || 7) - playerCards.length;
    for (let i = 0; i < neededCardsNum; i++) {
      let card = getAnswerCard(room);

      // reset cards
      if (!card) {
        resetAvailableAnswerCards(room);
        card = getAnswerCard(room);
      }

      newCards.push({ ...card, id: uuid() });
    }

    setPlayerCards(room, sid, [...playerCards, ...newCards]);

    // set score to 0 if it doesn't exist
    if (!getPlayerScore(room, sid)) setPlayerScore(room, sid, 0);
  });

  // get index of current czar
  const czarSid = getCurrentCzar(room);

  // find index of current czar
  let czarIndex = players.findIndex(p => p.sid === czarSid);
  if (czarIndex > -1) {
    const nextCzar = players[(czarIndex + 1) % players.length].sid;
    setCurrentCzar(room, nextCzar);
  } else {
    console.log("error finding czar, defaulting to first player");
    setCurrentCzar(room, players[0].sid);
  }

  // go to player submission state
  setGameStatus(room, status.playersSubmitAnwsers);
  return room;
};
