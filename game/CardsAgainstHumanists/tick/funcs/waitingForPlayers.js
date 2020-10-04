const { getPlayers, setGameStatus, status } = require("../../state/util");

/*
 * Tick function for the WAITING_FOR_PLAYERS game state
 */
module.exports = room => {
  // do nothing, game must be started by room owner
  const players = getPlayers(room);

  // start game when at least 2 players have joined
  if (players.length >= 2) {
    setGameStatus(room, status.startGame);
    return room;
  }

  return null;
};
