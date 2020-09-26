const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");

// server loader
// starts up express and socket.io
module.exports = (config) => {
  if (!config || !config.PORT) {
    throw new Error("invalid config: no port number specified");
  }

  const app = express();

  // enable cors
  app.use(cors());

  app.get("/", function (req, res) {
    res.end(":^)");
  });

  // start express
  const server = app.listen(config.PORT, () => {
    console.log(`express started on port ${config.PORT}`);
  });

  // start socket.io server, mounting it to express
  const socketServer = socketIO(server);

  return { server, socketServer };
};
