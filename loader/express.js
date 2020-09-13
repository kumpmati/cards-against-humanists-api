const express = require("express");
const socketIO = require("socket.io");

// server loader
// starts up express on the configured port, then attaches socket.io
module.exports = (config) => {
  if (!config || !config.PORT) {
    throw new Error("invalid config: no port number specified");
  }

  const app = express();
  // start express
  const server = app.listen(config.PORT, () => {
    console.log(`listening to ${config.PORT}`);
  });
  // display server port
  app.get("/port", function (req, res) {
    res.end(config.PORT.toString());
  });

  // start websocket server
  const socketServer = socketIO(server);

  console.log("server loaded");
  return { server, socketServer };
};
