// TODO: update game states to db

class GameHandler {
  constructor({ db }) {
    this.db = db;
    this.activeGames = new Map();
    this.activePlayers = new Map();
  }

  // adds a player based on the session id
  addPlayer({ room_name, session_id, data }) {
    if (!session_id || !data) {
      console.error("missing parameters in addPlayer");
      return;
    }

    // if given a room name, check that room exists
    if (!!room_name) {
      if (!this.gameExists(room_name)) {
        console.error("tried adding player to non-existing game:", room_name);
        return;
      }

      const game = this.getGame(room_name);
      if (game.players.has(session_id)) {
        console.error("tried adding player to game they are already in");
        return;
      }
      game.players.set(session_id, data);
    }

    this.activePlayers.set(session_id, { ...data, room_name });
    return { ...data, room_name };
  }

  // removes a player based on the session id
  removePlayer({ room_name, session_id }) {
    if (!session_id) {
      console.error("missing parameters in removePlayer");
      return null;
    }

    // if given a room name, remove player from that room
    if (!!room_name) {
      // check that room exists
      if (!this.gameExists(room_name)) {
        console.error(
          "tried removing player from non-existing game:",
          room_name
        );
        return null;
      }

      const game = this.getGame(room_name);
      game.players.delete(session_id);
    }

    this.activePlayers.delete(session_id);
  }

  // changes a player from one room to another (or leave all rooms if room_name is null)
  changePlayerRoom({ room_name, session_id }) {
    if (!room_name || !session_id) {
      console.error("missing parameters in removePlayer");
      return null;
    }

    const playerData = this.activePlayers.get(session_id);
    // remove player from old game.
    // deletes the player from the active player list, so must be done before adding him again!
    this.removePlayer({ room_name: playerData.room_name, session_id });
    // add player to new game
    this.addPlayer({ room_name, session_id });
  }

  /*
   * Creates a new game with the given initial state.
   * Returns the game's id if game is created successfully
   * and null if game already exists.
   */
  newGame({ room_name, game }) {
    if (!game) {
      console.error("tried to start undefined game");
      return null;
    }

    if (this.gameExists(room_name)) {
      console.error("game already exists:", room_name);
      return null;
    }

    // initialize the game
    this.activeGames.set(room_name, {
      // used to update the global game state according to rules
      evaluate: game.evaluate,
      // used to remove info about other players when returning state
      sanitize: game.sanitize,
      // current state of game
      state: game.initialState,
      // player list
      players: new Map(),
    });

    return room_name;
  }

  // evaluates given data against the current state of the chosen game
  // returns the updated state of the game if data is valid,
  // null if data is invalid
  evaluateData({ room_name, data }) {
    const game = this.getGame(room_name);
    if (!game) {
      console.error("tried evaluating move in non-existing game:", room_name);
      return null;
    }

    // evaluate data against current state
    const newState = game.evaluate(game.state, data);
    // if there is a new state, update it to the game and return it
    if (newState) {
      game.state = newState;
      // update the game
      this.activeGames.set(room_name, game);
      // return the new state
      return newState;
    }

    return null;
  }

  // returns the current state of a game
  // returns null if the game doesn't exist
  getGameState(room_name) {
    const game = this.getGame(room_name);
    if (!game) {
      console.error("tried getting state of non-existing game");
      return null;
    }

    return game.state;
  }

  // get game state sanitized to a specific session id
  getGameStateBySessionId({ room_name, session_id }) {
    const game = this.getGame(room_name);
    return game.sanitize(game.state);
  }

  gameExists(room_name) {
    return this.activeGames.has(room_name);
  }
  getGame(room_name) {
    return this.activeGames.get(room_name);
  }
  getPlayer(session_id) {
    return this.activePlayers.get(session_id);
  }
}

module.exports = GameHandler;
