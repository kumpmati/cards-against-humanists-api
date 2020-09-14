const validParams = (data) => !!data && !!data.sid;

// VALIDATE_SESSION
async function validateSession({ data, rtDB, socket }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid"],
    };
  }

  const player = await rtDB.getPlayer(data.sid);
  if (!player) {
    return {
      error: "NOT_FOUND",
      data: "could not find player",
    };
  }

  // join room matching session id
  socket.join(data.sid);
  return player;
}

module.exports = validateSession;
