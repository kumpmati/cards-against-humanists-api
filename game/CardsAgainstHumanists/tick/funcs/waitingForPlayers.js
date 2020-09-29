const { getPlayers, setGameStatus, status } = require("../../state/util");

/*
 * Tick function for the WAITING_FOR_PLAYERS game state
 */
module.exports = (room) => {
  const players = getPlayers(room);

  if (players.length >= 2) {
    setGameStatus(room, status.startGame);
    return room;
  }
  // do nothing for now
  return null;
};
