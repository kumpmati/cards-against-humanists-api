const CardsAgainstHumanists = require("../../game/CardsAgainstHumanists");

// CREATE_ROOM actions and response
module.exports = ({ data, gameHandler }) => {
  if (!data.room_name) {
    return { error: "MISSING_PARAMS", data: ["room_name"] };
  }
  // create a game. returns null if game can't be created
  const gameCreated = gameHandler.newGame({
    room_name: data.room_name,
    game: CardsAgainstHumanists,
  });

  return gameCreated
    ? { room_name: data.room_name }
    : { error: "INVALID_ACTION", data: "room already exists" };
};
