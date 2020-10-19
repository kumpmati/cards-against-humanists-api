const {
  status,
  setGameStatus,
  getPlayers,
  setPlayerScore,
  setCurrentCzar,
  setAvailableCards,
} = require("../../state/util");

/*
 * Tick function for the START_GAME game state
 */
module.exports = async room => {
  // set each player's score to 0
  room.players.forEach(player => setPlayerScore(room, player.sid, 0));

  const { packs } = room.room_options;
  const cards = await room.getCards(packs || ["all"]); // default to all cards
  setAvailableCards(room, cards);

  // choose a random czar
  const players = getPlayers(room);
  const i = ~~(Math.random() * players.length);
  setCurrentCzar(room, players[i].sid);

  // go to game loop
  setGameStatus(room, status.gameLoop);
  return room;
};
