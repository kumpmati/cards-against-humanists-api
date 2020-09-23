// must include sid and room_name
const validParams = (data) => !!data && !!data.sid;

// LEAVE_ROOM
function leaveRoom({ data, rtDB }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid"],
    };
  }

  // remove player from room
  // todo: make removing update player to db
  console.log("leaveRoom todo: make removing update player to db");
  const result = rtDB.leaveRoom(data.sid);
  return result;
}

module.exports = leaveRoom;
