const { v5: uuidv5 } = require("uuid");

// NEW_SESSION actions and response
module.exports = ({ data, gameHandler }) => {
  if (!data.name) {
    return { error: "MISSING_PARAMS", data: ["name"] };
  }

  // generate unique UID for session
  const session_id = uuidv5(data.name + new Date(), uuidv5.DNS);
  // add player to active player list, but not in any game room
  gameHandler.addPlayer({
    session_id,
    data: { name: data.name },
  });

  // return the session data
  return { session_id, ...gameHandler.getPlayer(session_id) };
};
