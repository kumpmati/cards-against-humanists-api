// load environment variables
require("dotenv").config();

const firebaseConfig = require("../firebase/config");

module.exports = () => {
  // global config
  const config = {
    PORT: process.env.PORT || 9000,
    firebaseConfig,
  };

  return config;
};
