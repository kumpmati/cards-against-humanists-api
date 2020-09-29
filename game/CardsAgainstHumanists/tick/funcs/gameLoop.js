const {
  status,
  setGameStatus,
  setCurrentQuestion,
} = require("../../state/util");

/*
 * Tick function for the GAME_LOOP game state
 */
module.exports = (room) => {
  // put a question card on the table
  // TODO: actually a random card
  setCurrentQuestion(room, {
    text: "___ tekee taukojumpasta kiinnostavampaa " + ~~(Math.random() * 1000),
    required_cards: 1,
  });

  // go to player submission state
  setGameStatus(room, status.playersSubmitAnwsers);
  return room;
};
