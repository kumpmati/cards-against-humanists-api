import { Socket } from "socket.io";
import { GameController } from "../../controller/game/game";
import { UserController } from "../../controller/user/user";
import { Game } from "../types";

/**
 * Cards Against Humanists game implementation.
 * An instance of this class represents a single game,
 * and each active game or room should have its own instance.
 */
export class Cahum implements Game {
  private users: Set<UserController<CahumEventTypes, CahumEvent>>;
  private readonly gameController;

  constructor() {
    this.gameController = new GameController();
    this.users = new Set<UserController<CahumEventTypes, CahumEvent>>();
  }

  public start = () => {
    this.gameController.GameCreated.trigger("game created");
  };

  public end = () => {
    this.gameController.GameDeleted.trigger("game deleted");
  };

  /**
   * Called when a socket connects to the game.
   * @param s Socket
   */
  public handleSocket = (s: Socket) => {
    const user = new UserController<CahumEventTypes, CahumEvent>(s);

    this.users.add(user);
  };
}

export enum CahumEventTypes {
  Message = "msg",
}

export interface CahumEvent {}
