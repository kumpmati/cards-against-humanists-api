import { Socket } from "socket.io";
import { isAuthToken, validate } from "../auth";

/**
 * Handles events coming from a socket.
 * Used as the connection handler for namespace "lobby"
 * @param s Socket
 */
export const lobbySocketHandler = (s: Socket) => {
  s.on("auth", (token: any) => handleAuth(s, token));
};

const handleAuth = (s: Socket, token: any) => {
  if (!isAuthToken(token)) {
    s.emit("error", "No token provided");
    return;
  }

  if (validate(token)) {
    s.emit("msg", "Authenticated");
    return;
  }

  s.emit("error", "Invalid token");
};
