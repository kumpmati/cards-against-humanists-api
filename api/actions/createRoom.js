// must include room_name, room_password and game_type
const validParams = (data) =>
  !!data &&
  !!data.sid &&
  !!data.room_name &&
  (!!data.room_password || data.room_password === "") &&
  !!data.game_type;

// CREATE_ROOM
function createRoom({ data, rtDB }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid", "room_name", "room_password", "game_type"],
    };
  }

  if (!rtDB.getPlayer(data.sid)) {
    return {
      error: "INVALID_REQUEST",
      data: "player not found",
    };
  }

  const result = rtDB.createRoom({
    room_name: data.room_name,
    room_password: data.room_password,
    game_type: data.game_type,
  });

  return result;
}

module.exports = createRoom;
