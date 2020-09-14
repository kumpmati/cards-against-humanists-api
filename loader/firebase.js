const firebase = require("../firebase/firebase");
const Database = require("../firebase/database");

module.exports = ({ firebaseConfig }) => {
  // initialize app and realtime database connection
  const app = firebase.initializeApp(firebaseConfig);
  const rtDB = new Database(app);
  return { app, rtDB };
};
