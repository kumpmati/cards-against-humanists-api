// VALIDATE_SESSION actions and response
module.exports = ({ data, gameHandler, socket }) => {
  if (!data || !data.session_id) {
    return {
      error: "MISSING_PARAMS",
      data: ["session_id"],
    };
  }
  const playerData = gameHandler.getPlayer(data.session_id);
  if (!playerData) {
    return {
      error: "ID_NOT_FOUND",
    };
  }

  // attach session id to socket
  socket.session_id = data.session_id;

  return { session_id: data.session_id, ...playerData };
};
