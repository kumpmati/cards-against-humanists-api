const loadConfig = require("./config");
const loadServer = require("./express");
const loadFirebase = require("./firebase");
const loadDBHandler = require("./db");
const loadHandlers = require("./handlers");

// main loader
module.exports = async () => {
  // config
  const config = loadConfig();

  // firebase core and realtime database
  const { app, db } = await loadFirebase(config);

  // load db handler
  const rtDBHandler = loadDBHandler({ config, db });

  // express and socket.io
  const { socketServer } = loadServer(config);

  // attach socket server and game handler
  loadHandlers({ socketServer, rtDB: rtDBHandler });
};
