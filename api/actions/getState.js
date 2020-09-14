// must include sid
const validParams = (data) => !!data && !!data.sid;

// GET_STATE
async function getState({ data, rtDB, socket }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid"],
    };
  }

  const player = await rtDB.getPlayer(data.sid);
  if (!player) {
    return {
      error: "INVALID_ACTION",
      data: "player not found",
    };
  }

  const room = await rtDB.getRoom(player.current_room);
  if (!room) {
    return {
      error: "INVALID_ACTION",
      data: "room not found",
    };
  }

  return room;
}

module.exports = getState;
