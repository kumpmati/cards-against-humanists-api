const {
  status,
  setGameStatus,
  getPlayers,
  setPlayerScore,
  setCurrentCzar,
} = require("../../state/util");

/*
 * Tick function for the START_GAME game state
 */
module.exports = (room) => {
  // set each player's score to 0
  room.players.forEach((player) => setPlayerScore(room, player.sid, 0));

  // choose a random czar
  const players = getPlayers(room);
  const i = ~~(Math.random() * players.length);
  setCurrentCzar(room, players[i].sid);

  // go to game loop
  setGameStatus(room, status.gameLoop);
  return room;
};
