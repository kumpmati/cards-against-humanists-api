/*
 * Game
 */
const { formatter } = require("../../game/CardsAgainstHumanists");
const { missingParamsErr } = require("../../util/errors");

// must include sid
const validParams = data => !!data && !!data.sid;

// GET_STATE
function getState({ data, rtDB }) {
  if (!validParams(data)) {
    return missingParamsErr("sid");
  }

  const player = rtDB.getPlayer(data.sid);
  if (!player) {
    return {
      error: "INVALID_REQUEST",
      data: "player not found",
    };
  }

  const room = rtDB.getRoom(player.current_room);
  if (!room) {
    return {
      error: "INVALID_REQUEST",
      data: "room not found",
    };
  }

  // todo: sanitize data before returning
  return formatter(room, player.sid);
}

module.exports = getState;
