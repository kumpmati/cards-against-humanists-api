const {
  status,
  getCurrentCzar,
  getAllSubmissions,
  setPlayerScore,
  getPlayerScore,
  setGameStatus,
  clearSubmittedCards,
  setWinningCards,
  clearTimer,
} = require("../../state/util");

/*
 * Evaluator for the CZAR_CHOOSES_WINNER game state
 */
const czarChoosesWinnerFunc = (room, action) => {
  const { data, sid } = action;

  /*
   * Necessary conditions for evaluation
   */
  const senderIsCzar = sid === getCurrentCzar(room);
  const dataIsValid = data && data.winner;

  if (!senderIsCzar || !dataIsValid) return null;

  // submissions are in format: [submitted_sid, submitted_cards]
  for (const [submitterSid, submittedCards] of getAllSubmissions(room)) {
    if (JSON.stringify(submittedCards) === JSON.stringify(data.winner)) {
      // add a point to the winner
      const score = getPlayerScore(room, submitterSid);
      setPlayerScore(room, submitterSid, score + 1);

      // clear timer before next state
      clearTimer(room);

      // display the winning card(s)
      setWinningCards(
        room,
        submittedCards.map(c => ({ id: c.id }))
      );

      // go to next status
      setGameStatus(room, status.showWinner);
      return room;
    }
  }

  return null;
};

module.exports = czarChoosesWinnerFunc;
