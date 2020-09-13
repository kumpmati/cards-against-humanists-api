// GET_GAME_STATE actions and response
module.exports = ({ data, gameHandler, socket }) => {
  // error if necessary info is missing
  if (!data.room_name || !data.session_id) {
    return {
      error: "MISSING_PARAMS",
      data: ["room_name", "session_id"],
    };
  }

  // error if socket is not in that room
  if (!socket.rooms[data.room_name]) {
    return {
      error: "INVALID_ACTION",
      data: `Not in room ${data.room_name}`,
    };
  }

  const gameState = gameHandler.getGameState(data.room_name);
  if (!gameState) {
    return { error: "INVALID_ACTION", data: "Game not found" };
  }
  return { data: gameState };
};
