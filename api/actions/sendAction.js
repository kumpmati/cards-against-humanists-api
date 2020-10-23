// must include sid
const validParams = data => !!data && !!data.sid && !!data.data;

// SEND_ACTION
function sendAction({ data, rtDB }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid", "data"],
    };
  }

  const player = rtDB.getPlayer(data.sid);
  if (!player) {
    return { error: "INVALID_REQUEST", data: "player not found" };
  }

  // get current room player is in
  const room = rtDB.getRoom(player.current_room);
  if (!room) {
    return { error: "INVALID_REQUEST", data: "room not found" };
  }

  // evaluate the 'data' field of the client request
  const evaluationResult = rtDB.evaluateActionData({ room, data });
  return evaluationResult ? evaluationResult : { success: 1 };
}

module.exports = sendAction;
