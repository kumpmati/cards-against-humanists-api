// must include sid, room_name and room_password
const validParams = (data) =>
  !!data && !!data.sid && !!data.room_id && !!data.room_password;

// JOIN_ROOM
function joinRoom({ data, rtDB }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid", "room_id", "room_password"],
    };
  }

  // leave other room first
  rtDB.leaveRoom(data.sid);

  // add player to room
  // todo: check password
  const result = rtDB.joinRoom({
    sid: data.sid,
    room_id: data.room_id,
    room_password: data.room_password,
  });

  return result;
}

module.exports = joinRoom;
