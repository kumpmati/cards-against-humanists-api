const { actions, types } = require("./actions");

function executeAction({ data, socket, rtDB }) {
  // destructure type and data
  const params = { data: data.data, socket, rtDB };

  // execute action based on type
  switch (data.type) {
    case types.NewSession:
      return actions.newSessionAction(params);

    case types.ValidateSession:
      return actions.validateSessionAction(params);

    case types.JoinRoom:
      return actions.joinRoomAction(params);

    case types.LeaveRoom:
      return actions.leaveRoomAction(params);

    case types.CreateRoom:
      return actions.createRoomAction(params);

    case types.GetState:
      return actions.getStateAction(params);

    default:
      return {
        error: "INVALID_TYPE",
        data: "invalid data type",
      };
  }
}

module.exports = { executeAction };
