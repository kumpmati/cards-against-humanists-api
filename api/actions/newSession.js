const { v5: uuidv5 } = require("uuid");

const validParams = data => !!data && !!data.name;
const validName = s => s.trim() !== "" && s.trim().length >= 1;

// NEW_SESSION
function newSession({ data, rtDB, socket }) {
  if (!validParams(data)) {
    return {
      error: "MISSING_PARAMS",
      data: ["name"],
    };
  }
  // validate name
  if (!validName(data.name)) {
    return {
      error: "INVALID_REQUEST",
      data: "name is invalid",
    };
  }

  const trimmedName = data.name.trim();
  // generate fresh session id
  const sid = uuidv5(trimmedName + new Date(), uuidv5.DNS);

  // add player to database
  const player = rtDB.createPlayer({ sid, name: trimmedName });

  // join room matching session id
  socket.join(sid);
  return player;
}

module.exports = newSession;
