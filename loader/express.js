const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");

// server loader
// starts up express on the configured port, then attaches socket.io
module.exports = (config) => {
  if (!config || !config.PORT) {
    throw new Error("invalid config: no port number specified");
  }

  const app = express();
  // display server port
  // enable CORS
  app.get("/port", cors(), function (req, res) {
    res.end(config.PORT.toString());
  });

  // start express
  const server = app.listen(config.PORT, () => {
    console.log(`listening to ${config.PORT}`);
  });

  // start websocket server
  const socketServer = socketIO(server);

  console.log("server loaded");
  return { server, socketServer };
};
