const DBHandler = require("../handler/db");

// db handler loader
module.exports = ({ rtDB }) => {
  return new DBHandler({ rtDB });
};
