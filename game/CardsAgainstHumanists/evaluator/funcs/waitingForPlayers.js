const { getOwner, setGameStatus, status } = require("../../state/util");

/*
 * Evaluator for the WAITING_FOR_PLAYERS game state
 */
const waitingForPlayers = (room, action) => {
  const { data, sid } = action;

  // check if client is room owner
  const isOwner = sid === getOwner(room);

  // check that request is a vote request
  const isVote = data && data.vote;

  // do nothing if client is not room owner or request isn't a vote
  if (!isOwner || !isVote) return null;

  // if client is owner and is requesting to start the game
  if (data.vote === "start") {
    setGameStatus(room, status.startGame);
    return room;
  }

  return null;
};

module.exports = waitingForPlayers;
