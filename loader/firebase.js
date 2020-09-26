const firebase = require("../firebase/firebase");

module.exports = async ({ firebaseConfig }) => {
  // initialize firebase
  const app = firebase.initializeApp(firebaseConfig);
  // get a reference to the database
  const db = app.database();

  // sign in to firebase to get db read/write access
  if (!!firebaseConfig.dbEmail && !!firebaseConfig.dbPassword) {
    await app
      .auth()
      .signInWithEmailAndPassword(
        firebaseConfig.dbEmail,
        firebaseConfig.dbPassword
      );
  }

  return { app, db };
};
