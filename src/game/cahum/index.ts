import { Socket } from "socket.io";
import { v4 } from "uuid";
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
  private readonly gameID;

  constructor(gameID: string) {
    this.gameController = new GameController();
    this.users = new Set<UserController<CahumEventTypes, CahumEvent>>();
    this.gameID = gameID;
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

    user.Send(CahumEventTypes.Message, { userID: v4() });
    user.Event.on(CahumEventTypes.Message, console.log);
    this.users.add(user);
  };
}

export enum CahumEventTypes {
  Message = "msg",
}

export interface CahumEvent {
  userID: string;
}
