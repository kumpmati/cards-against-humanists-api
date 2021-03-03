import { Socket } from "socket.io";
import { Cahum } from ".";
import { Game } from "../types";

/**
 * Handles all events of a user when in the lobby.
 * @param s Socket
 * @param game The game instance that the lobby is for
 */
export const cahumLobbyHandler = (s: Socket, game: Game) => {
  if (!(game instanceof Cahum)) return;

  s.on("message", text => handleMessage(s, text));
  s.on("action", action => handleAction(s, action, game));
};

const handleMessage = (s: Socket, text: any) => {
  if (typeof text !== "string") return;

  s.emit("message", text);
  s.rooms.forEach(room => s.to(room).emit("message", text));
};

/**
 * Handles actions performed by the user
 * like starting the game or changing settings (TODO)
 * @param s Socket
 * @param action Action
 */
const handleAction = (s: Socket, action: CahumLobbyAction, game: Cahum) => {
  if (game.getHost() !== action.token) return;
};

interface CahumLobbyAction {
  token: string;
  action: string;
  args: any;
}
