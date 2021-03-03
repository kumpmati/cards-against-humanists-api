import { Socket } from "socket.io";

export interface Game {
  start: () => any;
  end: () => any;
  handleSocket: (s: Socket) => any;
  getID: () => string;
  getOptions: () => any;
}

export type GameType<T, O> = new (id: string, opts: O) => T;
