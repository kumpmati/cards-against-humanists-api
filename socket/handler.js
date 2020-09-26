const executeActionByType = require("./actions");

// simple data validation, check that data has an id and data
const validData = (data) => !!data && !!data.id && !!data.data;

//handle individual socket connections
function socketHandler({ socket, gameHandler }) {
  let response = null;

  socket.on("data", (incomingData) => {
    if (validData(incomingData)) {
      const { type, ...data } = incomingData.data;
      // execute necessary actions and get a response for the client
      response = executeActionByType(type, { data, gameHandler, socket });
    }
    // if response is null at this point, incoming data was invalid
    if (!response) {
      response = {
        error: "INVALID_ACTION",
        data: "invalid message type",
      };
    }
    // send response to client
    socket.emit("data", {
      id: incomingData.id,
      data: response,
    });
  });

  socket.on("disconnect", () => {
    if (socket.session_id) {
      const playerData = gameHandler.getPlayer(socket.session_id);
      if (!!playerData) {
        // remove player from room
        gameHandler.removePlayer({
          session_id: socket.session_id,
          room_name: playerData.room_name,
        });
      }
    } else {
      console.log("disconnected without session id");
    }
  });
}

module.exports = socketHandler;
