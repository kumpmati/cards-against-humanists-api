const firebase = require("../firebase/firebase");
const Database = require("../firebase/database");

module.exports = async ({ firebaseConfig }) => {
  // initialize app and realtime database connection
  const app = firebase.initializeApp(firebaseConfig);

  // sign in before initializing rtdb
  await app
    .auth()
    .signInWithEmailAndPassword(process.env.DB_EMAIL, process.env.DB_PASS);

  // initialize database
  const db = new Database(app.database());

  return { app, db };
};
