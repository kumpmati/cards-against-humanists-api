const { executeAction } = require("../api");

// data must contain id, data and type
const validData = (data) => !!data && !!data.id && !!data.data && !!data.type;

function socketHandler({ socket, game }) {
  socket.on("data", async (incomingData) => {
    const { id, type, data } = incomingData;

    let response = null;

    // if data is valid, find a matching action and execute it
    if (validData(incomingData)) {
      try {
        const message = { type, data };
        response = await executeAction({ data: message, socket, rtDB: game });
      } catch (err) {
        console.error(err);
        response = { error: "SERVER_ERROR", data: err };
      }
    }

    if (!response) {
      response = {
        error: "INVALID_DATA",
        data: "missing id, type or data field",
      };
    }

    // send response back to socket along with id
    socket.emit("data", { id, data: response });
  });
}

module.exports = socketHandler;
