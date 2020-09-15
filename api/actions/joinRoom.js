// must include sid, room_name and room_password
const validParams = (data) =>
  !!data && !!data.sid && !!data.room_name && !!data.room_password;

// JOIN_ROOM
async function joinRoom({ data, rtDB }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid", "room_name", "room_password"],
    };
  }

  // leave other room first
  await rtDB.leaveRoom(data.sid);

  // add player to room
  // todo: make joining update player to db
  console.log("joinRoom todo: make joining update player to db");
  console.log("joinRoom todo: check for password");
  const result = await rtDB.joinRoom({
    sid: data.sid,
    room_name: data.room_name,
    room_password: data.room_password,
  });

  return result;
}

module.exports = joinRoom;
