const { missingParamsErr } = require("../../util/errors");

// must include sid, room_name and room_password
const validParams = (data) => !!data && !!data.sid && !!data.room_id;

// JOIN_ROOM
function joinRoom({ data, rtDB }) {
  if (!validParams(data)) {
    return missingParamsErr("sid", "room_id");
  }

  // add player to room
  // todo: check password
  const result = rtDB.joinRoom({
    sid: data.sid,
    room_id: data.room_id,
    room_password: data.room_password || null,
  });

  return result;
}

module.exports = joinRoom;
