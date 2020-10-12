const { getHost, setGameStatus, status } = require("../../state/util");

/*
 * Evaluator for the WAITING_FOR_PLAYERS game state
 */
const waitingForPlayers = (room, action) => {
  const { data, sid } = action;

  const isHost = sid === getHost(room);
  const isVote = data && data.vote;

  if (isHost && isVote && data.vote === "start-game") {
    setGameStatus(room, status.startGame);
    return room;
  }

  return null;
};

module.exports = waitingForPlayers;
