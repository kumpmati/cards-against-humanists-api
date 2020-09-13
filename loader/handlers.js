const socketHandler = require("../socket/handler");
const { Heartbeat } = require("../types/message");

// socket handler loader
module.exports = ({ socketServer, gameHandler }) => {
  // inject game handler to socket handler
  socketServer.on("connection", (socket) => {
    // delegate socket to handler along with game handler
    socketHandler({ socket, gameHandler });

    // set up heartbeat signal
    setInterval(() => {
      socket.emit("data", { type: Heartbeat, data: new Date() });
    }, 2000);

    socket.on("disconnect", () => {
      clearInterval();
    });
  });
};
