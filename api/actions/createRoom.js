const { playerNotFoundErr, missingParamsErr } = require("../../util/errors");

// must include room_name, room_password and game_type
const validParams = (data) => !!data && !!data.sid;

// CREATE_ROOM
function createRoom({ data, rtDB }) {
  if (!validParams(data)) return missingParamsErr("sid");

  if (!rtDB.getPlayer(data.sid)) return playerNotFoundErr;

  const result = rtDB.createRoom({
    sid: data.sid,
    room_name: data.room_name || null,
    room_password: data.room_password || null,
  });

  return result;
}

module.exports = createRoom;
