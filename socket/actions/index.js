const messageTypes = require("../../types/message");

// actions
const newSession = require("./newSession");
const validateSession = require("./validateSession");
const joinRoom = require("./joinRoom");
const createRoom = require("./createRoom");
const gameData = require("./gameData");
const getGameState = require("./getGameState");

// branch different message types to different actions
function executeActionByType(type, params) {
  switch (type) {
    case messageTypes.NewSession:
      return newSession(params);

    case messageTypes.ValidateSession:
      return validateSession(params);

    case messageTypes.JoinRoom:
      return joinRoom(params);

    case messageTypes.CreateRoom:
      return createRoom(params);

    case messageTypes.GameData:
      return gameData(params);

    case messageTypes.GetState:
      return getGameState(params);

    default:
      return { error: "INVALID_TYPE", data: "invalid data type" };
  }
}

module.exports = executeActionByType;
