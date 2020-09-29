const socketHandler = require("../handler/socket");

/*
 * Game
 */
const { formatter } = require("../game/CardsAgainstHumanists");

// socket handler loader
function loadHandlers({ socketServer, game }) {
  // when a room is updated, send the new state to every session in that room
  game.on("room-update", (d) => {
    // get session ids of players in room
    const sessions = Array.from(d.players.keys());

    // send formatted data for each player in the room
    sessions.forEach((session) =>
      socketServer.to(session).emit("room-update", formatter(d, session))
    );
  });

  socketServer.on("connection", (socket) => socketHandler({ socket, game }));
}

module.exports = loadHandlers;
