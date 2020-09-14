const socketHandler = require("../handler/socket");

// socket handler loader
function loadHandlers({ socketServer, rtDB }) {
  socketServer.on("connection", (socket) => {
    // inject db handler
    socketHandler({ socket, rtDB });
  });
}

module.exports = loadHandlers;
