const loadConfig = require("./config");
const loadServer = require("./server");
const loadFirebase = require("./firebase");
const loadGameHandler = require("./game");
const loadHandlers = require("./handlers");

// main loader
module.exports = async () => {
	try {
		// config
		const config = loadConfig();

		// firebase core and realtime database
		const { db } = await loadFirebase(config);
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
