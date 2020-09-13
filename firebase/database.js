class Database {
  constructor(app) {
    this.db = app.database();
  }

  getRef(s) {
    return this.db.ref(s);
  }
  // returns a value without realtime updating
  once(s, callback) {
    this.getRef(s).once("value", (val) => callback(val.val()));
  }

  snapshot(s, callback) {
    this.getRef(s).on("value", (snap) => callback(snap.val()));
  }
}

module.exports = Database;
