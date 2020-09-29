const loadConfig = require("./config");
const loadServer = require("./server");
const loadGameHandler = require("./game");
const loadHandlers = require("./handlers");

// main loader
module.exports = async () => {
  try {
    // config
    const config = loadConfig();

    // firebase core and realtime database
    ///const { app, db } = await loadFirebase(config);
    const db = {};
    // load db handler
    const game = loadGameHandler({ config, db });

    // express and socket.io
    const { socketServer } = loadServer(config);

    // attach socket server and game handler
    loadHandlers({ socketServer, game });
  } catch (err) {
    console.error(err);
  }
};
