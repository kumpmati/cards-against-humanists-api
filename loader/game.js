const GameHandler = require("../handler/game");

// game handler loader
module.exports = ({ config, db }) => {
  if (!config || !config.gameHandlerConfig) {
    console.error("game handler config missing");
    return;
  }

  return new GameHandler({ config: config.gameHandlerConfig, db });
};
