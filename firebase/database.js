class Database {
  constructor(app) {
    this.db = app.database();
  }

  getRef(s) {
    return this.db.ref(s);
  }

  get(path, callback) {
    this.getRef(path).once("value", (val) => callback(val.val()));
  }

  set(path, value) {
    this.getRef(path).set(value);
  }

  listen(path, callback) {
    this.getRef(path).on("value", (val) => callback(val.val()));
  }

  listenForChanges(path, callback) {
    const ref = this.getRef(path);
    ref.on("child_added", (val) =>
      callback({ data: val.val(), type: "child_added" })
    );
    ref.on("child_removed", (val) =>
      callback({ data: val.val(), type: "child_removed" })
    );
    ref.on("child_changed", (val) =>
      callback({ data: val.val(), type: "child_changed" })
    );
  }
}

module.exports = Database;
