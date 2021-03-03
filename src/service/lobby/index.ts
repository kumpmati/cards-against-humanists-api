import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { cahumLobbyHandler } from "../../game/cahum/lobby";
import { isAuthToken, validate } from "../auth";
import { getGame } from "../game";

/**
 * Handles clients connecting to the 'lobby' namespace
 * @param io Socket.IO server instance
 */
export const startLobbyService = (io: SocketIOServer) => {
  const lobby = io.of("lobby");
  lobby.on("connection", lobbySocketHandler);
};

/**
 * Handles authentication of the socket.
 * After successful authentication the
 * @param s Socket
 */
const lobbySocketHandler = (s: Socket) => {
  s.on("auth", (token: any) => handleAuth(s, token));
};

/**
 * Handles lobby 'auth' events
 * @param s Socket
 * @param token AuthToken
 */
const handleAuth = async (s: Socket, token: unknown) => {
  if (!isAuthToken(token)) {
    s.emit("error", "No token provided");
    return;
  }

  if (validate(token)) {
    await s.join(token.gameID);
    s.emit("auth", token);

    const game = getGame(token.gameID);
    cahumLobbyHandler(s, game); // handle socket using the cahum lobby handler
    return;
  }

  s.emit("error", "Invalid token");
};
