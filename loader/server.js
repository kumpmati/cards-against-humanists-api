const express = require("express");
const socketIO = require("socket.io");

// server loader
// starts up express and socket.io
module.exports = (config) => {
  if (!config || !config.PORT) {
    throw new Error("invalid config: no port number specified");
  }

  const app = express();

  // start express
  const server = app.listen(config.PORT, () => {
    console.log(`express started on port ${config.PORT}`);
  });

  // start socket.io server, mounting it to express
  const socketServer = socketIO(server);

  return { server, socketServer };
};
