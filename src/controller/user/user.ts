import { Socket } from "socket.io";
import { Event, TypedEvent } from "../../event";

export class UserController<E, T> {
  private socket: Socket;

  private readonly onJoinGame = new Event<any>();
  private readonly onLeaveGame = new Event<any>();
  private readonly onEvent = new TypedEvent<E, T>();

  constructor(s: Socket) {
    this.socket = s;
  }

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
