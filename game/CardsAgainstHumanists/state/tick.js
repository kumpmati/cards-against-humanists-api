const {
  getGameStatus,
  status,
  setGameStatus,
  setPlayerScore,
  getPlayers,
} = require("./util");

// state is the current state of the room
// if the game needs to be updated, the function should return the new state
// if the game doesn't need updating this tick, then return null
const tick = (room) => {
  const numOfPlayers = getPlayers(room).length;
  const currentStatus = getGameStatus(room);

  // todo: end game if room has been inactive for a while
  switch (currentStatus) {
    /*
     * Wait for players
     */
    case status.waitingForPlayers:
      if (numOfPlayers >= 4) {
        // automatically start game when at least 4 players have joined
        setGameStatus(room, status.startGame);
        return room;
      }
      return null;

    /*
     * Start game
     */
    case status.startGame:
      // set each player's score to 0
      room.players.forEach((_, sid) => setPlayerScore(room, sid, 0));
      // go to game loop
      setGameStatus(room, status.gameLoop);
      return room;

    /*
     * Game loop
     */
    case status.gameLoop:
      // give each player 4 cards

      // choose random czar

      // put a question card on the table

      // go to player submission state
      setGameStatus(room, status.playersSubmitAnwsers);
      return room;

    /*
     * Players submit answers
     */
    case status.playersSubmitAnwsers:
      break;

    /*
     * Czar chooses winner
     */
    case status.czarChoosesWinner:
      break;

    /*
     * Default
     */
    default:
      // don't update room
      return null;
  }
};

module.exports = tick;
