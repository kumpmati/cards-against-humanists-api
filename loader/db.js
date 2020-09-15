const DBHandler = require("../handler/db");

// db handler loader
module.exports = ({ config, db }) => {
  if (!config || !config.dbHandlerConfig) {
    console.error("db handler config missing! db not loaded");
    return;
  }
  const cfg = config.dbHandlerConfig;
  return new DBHandler({ config: cfg, db });
};
