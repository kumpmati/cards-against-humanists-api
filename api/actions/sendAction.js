// must include sid
const validParams = (data) => !!data && !!data.sid && !!data.data;

// SEND_ACTION
async function sendAction({ data, rtDB, socket }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid", "data"],
    };
  }

  const player = await rtDB.getPlayer(data.sid);
  if (!player) {
    return { error: "INVALID_REQUEST", data: "player not found" };
  }

  // get current room player is in
  const room = await rtDB.getRoom(player.current_room);
  if (!room) {
    return { error: "INVALID_REQUEST", data: "room not found" };
  }

  // todo: evaluate using room's game
  console.log("sendAction todo: evaluate using room's game");
  return {
    error: "NOT_IMPLEMENTED",
    data: "this feature is not yet implemented",
  };
}

module.exports = sendAction;
