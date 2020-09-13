const loadConfig = require("./config");
const loadServer = require("./express");
const loadFirebase = require("./firebase");
const loadGameHandler = require("./game");
const loadHandlers = require("./handlers");

module.exports = () => {
  // config
  const config = loadConfig();

  // firebase core and realtime database
  const { app, db } = loadFirebase(config);

  // express and socket.io
  const { server, socketServer } = loadServer(config);

  // load game handler
  const gameHandler = loadGameHandler({ config, db });

  // handlers
  const handlers = loadHandlers({ socketServer, gameHandler });
};
