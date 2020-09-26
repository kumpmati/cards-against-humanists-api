const { v4: uuidv4 } = require("uuid");
const EventEmitter = require("events");

/*
 * Game
 */
const game = require("../game/CardsAgainstHumanists");

/*
 * Constants
 */
const INACTIVE_SWEEP_INTERVAL = 30;
const TIME_INACTIVE_UNTIL_REMOVE = 60;

/*
 * Game handler
 */
class GameHandler {
  constructor({ config }) {
    this.config = config;

    // in-memory maps of players and rooms
    this.playersList = new Map();
    this.roomsList = new Map();

    // initialize event emitter
    this.eventEmitter = new EventEmitter();

    // removes inactive sessions and rooms periodically
    setInterval(() => this.clearInactives(), INACTIVE_SWEEP_INTERVAL * 1000);

    // start updating rooms every second
    this.startGameLoops();
  }

  // expose event listener
  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }

  // could be more performant if every room was updated independently and not at once
  startGameLoops() {
    // start loop interval
    setInterval(() => {
      // iterate through every room
      this.roomsList.forEach((room, room_id) => {
        const newState = game.state.tick(room);
        // only broadcast the update if the tick doesn't return null
        if (!!newState) this.updateRoom({ room_id, room: newState });
      });
    }, 1000);
  }

  // create new player
  createPlayer({ sid, name }) {
    const player = {
      sid,
      name,
      current_room: -1,
      last_seen: -1,
    };

    // update player to in-memory map
    this.playersList.set(sid, player);
    return player;
  }

  // remove player
  deletePlayer(sid) {
    this.playersList.delete(sid);
  }

  // get player asynchronously
  getPlayer(sid) {
    return this.playersList.get(sid);
  }

  // set player value
  setPlayer(sid, value) {
    this.playersList.set(sid, value);
  }

  // create new room
  // TODO
  createRoom({ room_name, room_password }) {
    // create unique room id and trim it
    const room_id = uuidv4().slice(0, 5);

    // create a new room
    const room = {
      room_id,
      room_name,
      room_password,
      players: new Map(),
      state: game.state.initialState(),
    };

    // send an update event
    this.updateRoom({ room_id, room });
    return room;
  }

  // transfer player to a room
  // todo: make joining update player to db
  joinRoom({ sid, room_id }) {
    const player = this.getPlayer(sid);
    if (!player) {
      return { error: "NOT_FOUND", data: "player not found" };
    }

    const room = this.getRoom(room_id);
    if (!room) {
      return { error: "NOT_FOUND", data: "room not found" };
    }

    // mark player as active
    player.last_seen = -1;
    player.current_room = room_id;

    room.players.set(sid, player);
    // send an update event
    this.updateRoom({ room_id, room });
    return player;
  }

  // remove a player from a room
  leaveRoom(sid) {
    const player = this.getPlayer(sid);
    if (!player) {
      return { error: "NOT_FOUND", data: "player not found" };
    }

    const room = this.getRoom(player.current_room);
    if (!room) {
      return { error: "NOT_FOUND", data: "room not found" };
    }

    // mark player as inactive
    player.last_seen = new Date();
    player.current_room = -1;

    // delete player from the room
    room.players.delete(sid);
    // send an update event
    this.updateRoom({ room_id: room.room_id, room });
    return player;
  }

  // get room
  getRoom(room_id) {
    return this.roomsList.get(room_id);
  }

  // update room and emit event
  updateRoom({ room_id, room }) {
    this.roomsList.set(room_id, room);
    // emit new state to everyone listening for updates
    this.eventEmitter.emit("room-update", room);
  }

  // evaluate a new state
  evaluateActionData({ room, data }) {
    const validState = game.evaluator(room, data);
    // if evaluation returns null, data was invalid and room should not be updated
    if (!validState) {
      return { error: "INVALID_MOVE", data: "move not allowed" };
    }

    // update room state
    room = validState;
    // send an update event
    this.updateRoom({ room_id: room.room_id, room });
    return null;
  }

  // removes inactive players and empty rooms
  // todo: implement inactive session deletion
  clearInactives() {}
}

module.exports = GameHandler;
