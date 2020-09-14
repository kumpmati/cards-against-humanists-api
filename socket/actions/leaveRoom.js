// LEAVE_ROOM actions and response
module.exports = ({ data, gameHandler, socket }) => {
  // error if name or session id is missing
  if (!data.room_name || !data.session_id) {
    return {
      error: "MISSING_PARAMS",
      data: ["room_name", "session_id"],
    };
  }

  // error if room doesn't exist
  if (!gameHandler.getGame(data.room_name)) {
    return { error: "INVALID_ACTION", data: "Game does not exist" };
  }

  const playerData = gameHandler.getPlayer(data.session_id);
  if (!!playerData) {
    gameHandler.removePlayer({
      room_name: data.room_name,
      session_id: data.session_id,
    });
  }

  // TODO: leave all other rooms
  socket.join(data.room_name);
  return { room_name: data.room_name };
};
