import { Socket } from "socket.io";

import { GameController } from "../../controller/game/game";
import { UserController } from "../../controller/user/user";
import { AuthToken } from "../../service/auth/types";
import { Game } from "../types";

type CahumUserController = UserController<CahumEventTypes, CahumEvent>;

/**
 * Cards Against Humanists game implementation.
 * An instance of this class represents a single game,
 * and each active game or room should have its own instance.
 */
export class Cahum implements Game {
  private readonly gameController;
  private readonly gameID;
  private readonly options;

  private users: Set<CahumUserController>;
  private host: string = null;

  /**
   * Instantiates the game class, setting up the GameController.
   * @param gameID Unique ID used to identify the game and connect to it.
   * @param settings Game options to set
   */
  constructor(gameID: string, settings: CahumCreateSettings) {
    this.gameID = gameID;
    this.options = settings;

    this.gameController = new GameController();
    this.users = new Set<CahumUserController>();
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
    // TODO: handle user
  };

  /**
   * Sets the token of the current host
   * @param token Token
   */
  public setHost = (token: string) => {
    this.host = token;
  };

  /**
   * Returns the token of the current host
   */
  public getHost = () => this.host;

  /**
   * Returns the game's ID.
   * This ID can be used to find the game in the list of active games.
   */
  public getID = () => this.gameID;

  public getOptions = () => this.options;
}

export interface CahumCreateSettings {
  password: string;
  packs: string[];
  czarReveals: boolean;
  shuffleAnswers: boolean;
}

export const isCahumCreateSettings = (o: unknown): o is CahumCreateSettings => {
  return (
    o != null &&
    typeof o === "object" &&
    o.hasOwnProperty("password") &&
    o.hasOwnProperty("packs") &&
    o.hasOwnProperty("czarReveals") &&
    o.hasOwnProperty("shuffleAnswers")
  );
};

export interface CahumJoinOptions {
  roomCode: string;
  password?: string;
  token?: AuthToken;
}

export const isCahumJoinOptions = (o: unknown): o is CahumJoinOptions => {
  return o != null && typeof o === "object" && o.hasOwnProperty("roomCode");
};

export enum CahumEventTypes {
  Message = "msg",
}

export interface CahumEvent {
  userID: string;
}
