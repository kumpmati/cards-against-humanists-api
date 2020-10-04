const {
  status,
  setGameStatus,
  setCurrentQuestion,
  getPlayers,
  setPlayerCards,
  clearSubmittedCards,
  getPlayerScore,
  setPlayerScore,
  getCurrentCzar,
  setCurrentCzar,
  getPlayerCards,
} = require("../../state/util");

/*
 * Tick function for the GAME_LOOP game state
 */
module.exports = room => {
  // get one question card from server
  const [question] = room.getCards(true, 1);
  setCurrentQuestion(room, question);

  // remove any submitted cards
  clearSubmittedCards(room);

  const players = getPlayers(room);
  // move to waiting if not enough players
  if (players.length < 2) {
    setGameStatus(room, status.waitingForPlayers);
    return room;
  }

  // loop through players
  players.forEach(({ sid }) => {
    const playerCards = getPlayerCards(room, sid) || [];

    // get enough new cards for player to have 7 cards in total
    const neededCardsNum = 7 - playerCards.length;
    const newCards = room.getCards(false, neededCardsNum); // get
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
