const INACTIVE_SWEEP_INTERVAL = 30;
const TIME_INACTIVE_UNTIL_REMOVE = 60;

class DBHandler {
  constructor({ rtDB }) {
    this.playerList = new Map();
    this.roomList = new Map();

    // todo: listen for DB changes
    console.log("dbhandler todo: listen for DB changes");

    // clear inactive players and rooms periodically
    setInterval(() => this.clearInactives(), INACTIVE_SWEEP_INTERVAL * 1000);
  }

  // create new player
  createPlayer({ sid, name }) {
    const player = {
      sid,
      name,
      current_room: null,
      last_seen: null,
    };

    this.playerList.set(sid, player);
    return player;
  }

  // remove player
  deletePlayer(sid) {
    this.playerList.delete(sid);
  }

  // get player
  getPlayer(sid) {
    return this.playerList.get(sid);
  }

  // set player value
  setPlayer(sid, value) {
    this.playerList.set(sid, value);
  }

  // check that player exists
  playerExists(sid) {
    return this.playerList.has(sid);
  }

  // create new room
  // TODO
  createRoom({ room_name, room_password, game_type }) {
    const room = {
      room_name,
      room_password,
      game_type,
    };

    if (this.roomExists(room_name)) {
      return { error: "INVALID_REQUEST", data: "room already exists" };
    }

    // add room to list
    this.roomList.set(room_name, room);
    return room;
  }

  // get room
  getRoom(room_name) {
    return this.roomList.get(room_name);
  }

  // check that room exists
  roomExists(room_name) {
    return this.roomList.has(room_name);
  }

  // transfer player to a room
  // todo: make joining update player to db
  joinRoom({ sid, room_name }) {
    if (!this.roomExists(room_name)) {
      return { error: "NOT_FOUND", data: "room not found" };
    }
    if (!this.playerExists(sid)) {
      return { error: "NOT_FOUND", data: "player not found" };
    }

    const room = this.getRoom(room_name);
    const player = this.getPlayer(sid);

    // mark player as active
    player.last_seen = null;
    player.current_room = room_name;
    // todo: add player to room player list
    return player;
  }

  // remove a player from a room
  leaveRoom(sid) {
    if (!this.playerExists(sid)) {
      return { error: "NOT_FOUND", data: "player not found" };
    }

    const player = this.getPlayer(sid);
    if (!this.roomExists(player.current_room)) {
      return { error: "NOT_FOUND", data: "room not found" };
    }

    // mark player as inactive
    player.last_seen = new Date();
    player.current_room = null;

    // todo: remove player from room
    // and update player and room to db
    return player;
  }

  // removes inactive players and empty rooms
  clearInactives() {
    const currentTime = new Date();

    let numDeletedPlayers = 0;
    // iterate players
    this.playerList.forEach((player, sid) => {
      // skip active players
      if (!!player.last_seen) {
        const secondsInactive = (currentTime - player.last_seen) / 1000;
        if (secondsInactive > TIME_INACTIVE_UNTIL_REMOVE) {
          // remove player
          this.deletePlayer(sid);
          numDeletedPlayers++;
        }
      }
    });

    if (numDeletedPlayers > 0) {
      console.log(`deleted ${numDeletedPlayers} players`);
    }
  }
}

module.exports = DBHandler;
