const { GameHandler } = require("../game");

module.exports = ({ config, db }) => {
  return new GameHandler({ config, db });
};
