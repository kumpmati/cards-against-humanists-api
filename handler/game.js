const { v4: uuidv4 } = require("uuid");
const EventEmitter = require("events");

const {
  roomNotFoundErr,
  roomAlreadyExistsErr,
  playerNotFoundErr,
  wrongPassErr,
} = require("../util/errors");
const game = require("../game/CardsAgainstHumanists");

/*
 * Constants
 */
const INACTIVE_SWEEP_INTERVAL = 30; // 30 seconds
const TIME_INACTIVE_UNTIL_REMOVE = 5 * 60; // 5 minutes
const ROOM_UPDATE_PERIOD = 1; // 1 second

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

    this.startGameLoop();
    this.startCleanupLoop();
  }

  // expose event listener
  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }

  // create new player
  createPlayer({ sid, name }) {
    const player = {
      sid,
      name,
      current_room: -1,
      last_seen: new Date(),
    };

    // update player to in-memory map
    this.playersList.set(sid, player);
    return player;
  }

  // remove player
  deletePlayer(sid) {
    this.playersList.delete(sid);
  }

  // get player
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
    // generate random id if no name is specified
    const room_id = room_name ? room_name : uuidv4().slice(0, 4);

    // check that room with specified name does not exist
    if (this.getRoom(room_id)) return roomAlreadyExistsErr;

    // create a new room
    const room = {
      room_id,
      room_password,
      players: new Map(),
      state: game.state.initialState(),
      last_action: new Date(),
    };

    // send an update event
    this.updateRoom({ room_id, room });
    return { room_id, room_password };
  }

  // transfer player to a room
  // todo: make joining update player to db
  joinRoom({ sid, room_id, room_password }) {
    const player = this.getPlayer(sid);
    if (!player) return playerNotFoundErr;

    // leave previous room if joining a different room than current
    if (player.current_room !== room_id) this.leaveRoom(sid);

    const room = this.getRoom(room_id);
    if (!room) return roomNotFoundErr;

    // check password
    if (room.room_password !== room_password) return wrongPassErr;

    // mark player as active
    player.last_seen = new Date();
    player.current_room = room_id;

    room.last_action = new Date();
    room.players.set(sid, player);
    // send an update event
    this.updateRoom({ room_id, room });
    return player;
  }

  // remove a player from a room
  leaveRoom(sid) {
    const player = this.getPlayer(sid);
    if (!player) return playerNotFoundErr;

    const room = this.getRoom(player.current_room);
    if (!room) return roomNotFoundErr;

    // mark player as inactive
    player.last_seen = new Date();
    player.current_room = -1;
    this.setPlayer(sid, player);

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
    // update last action timestamp
    this.roomsList.set(room_id, room);
    // emit new state to everyone listening for updates
    this.eventEmitter.emit("room-update", room);
  }

  deleteRoom(room_id) {
    this.roomsList.delete(room_id);
  }

  // evaluate a new state
  evaluateActionData({ room, data }) {
    const validState = game.evaluator(room, data);
    // if evaluation returns null, data was invalid and room should not be updated
    if (!validState) {
      return { error: "INVALID_MOVE", data: "move not allowed" };
    }

    const player = this.getPlayer(data.sid);
    if (!player) return playerNotFoundErr;

    // store timestamp of sent action
    player.last_seen = new Date();
    this.setPlayer(data.sid, player);

    // update room state
    room = validState;
    room.last_action = new Date();
    this.updateRoom({ room_id: room.room_id, room }); // send an update event
    return null;
  }

  // NOTE: could be better if every room was updated independently
  startGameLoop() {
    setInterval(
      () =>
        this.roomsList.forEach((room, room_id) => {
          const newState = game.tick(room);
          // only broadcast if the current tick resulted in an update
          if (!!newState) this.updateRoom({ room_id, room: newState });
        }),
      1000 * ROOM_UPDATE_PERIOD
    );
  }

  // removes inactive players and empty rooms
  // todo: implement inactive session deletion
  startCleanupLoop() {
    setInterval(() => {
      const currentTime = new Date();
      // check for inactive players
      this.playersList.forEach((player) => {
        if (player.last_seen === -1) return;

        const timeSinceLastAction = (currentTime - player.last_seen) / 1000;

        // remove player if they have been inactive for TIME_INACTIVE_UNTIL_REMOVE seconds
        if (timeSinceLastAction > TIME_INACTIVE_UNTIL_REMOVE) {
          this.leaveRoom(player.sid);
          this.deletePlayer(player.sid);
          console.log("deleted player", player.name);
        }
      });

      // remove any empty rooms
      this.roomsList.forEach((room, room_id) => {
        if (room.players.size > 0) return;

        const timeSinceLastAction = (currentTime - room.last_action) / 1000;

        // delete room if it has been inactive for TIME_INACTIVE_UNTIL_REMOVE seconds
        if (timeSinceLastAction > TIME_INACTIVE_UNTIL_REMOVE) {
          this.deleteRoom(room_id);
          console.log("deleted room", room_id);
        }
      });
    }, INACTIVE_SWEEP_INTERVAL * 1000);
  }
}

module.exports = GameHandler;
