import { Socket } from "socket.io";
import { Event, TypedEvent } from "../../event";
import { JoinGameEvent, LeaveGameEvent } from "./types";

export class UserController<E extends string, T> {
  private socket: Socket;

  private readonly onJoinGame = new Event<JoinGameEvent>();
  private readonly onLeaveGame = new Event<LeaveGameEvent>();
  private readonly onEvent = new TypedEvent<E, T>();

  constructor(s: Socket) {
    this.socket = s;
    this.socket.onAny(this.onEvent.trigger);
  }

  public Send = (event: E, data: T) => {
    this.socket.emit(event, data);
  };

  public get JoinGame() {
    return this.onJoinGame.expose();
  }

  public get LeaveGame() {
    return this.onLeaveGame.expose();
  }

  public get Event() {
    return this.onEvent.expose();
  }
}
