// must include sid and room_name
const validParams = (data) => !!data && !!data.sid;

// LEAVE_ROOM
async function leaveRoom({ data, rtDB, socket }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["sid"],
    };
  }

  // remove player from room
  // todo: make removing update player to db
  console.log("leaveRoom todo: make removing update player to db");
  const result = await rtDB.leaveRoom(data.sid);
  return result;
}

module.exports = leaveRoom;
