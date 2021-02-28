import { Socket } from "socket.io";

export interface Game {
  start: () => any;
  end: () => any;
  handleSocket: (s: Socket) => any;
}
