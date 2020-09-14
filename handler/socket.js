const { executeAction } = require("../api");

// data must contain id, data and type
const validData = (data) => !!data && !!data.id && !!data.data && !!data.type;

function socketHandler({ socket, rtDB }) {
  socket.on("data", async (incomingData) => {
    // destructure incoming data
    const { id, type, data } = incomingData;
    let response;

    if (validData(incomingData)) {
      const message = { type, data };
      response = await executeAction({ data: message, socket, rtDB });
    }

    if (!response) {
      response = { error: "INVALID_DATA", data: "data is invalid" };
    }

    // send response back to socket along with id
    socket.emit("data", { id, data: response });
  });
}

module.exports = socketHandler;
