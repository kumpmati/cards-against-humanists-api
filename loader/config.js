// load environment variables
require("dotenv").config();

const firebaseConfig = require("../config/firebase");
const gameHandlerConfig = require("../config/gameHandler");

module.exports = () => {
	// global config
	const config = {
		PORT: process.env.PORT || 9000,
		firebaseConfig,
		gameHandlerConfig,
	};

	return config;
};
