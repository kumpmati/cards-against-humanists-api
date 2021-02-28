import { Event } from "../../event";

export class GameController {
  private readonly onCreateGame = new Event<CreateGameEvent>();
  private readonly onDeleteGame = new Event<DeleteGameEvent>();

  private readonly onPlayerJoin = new Event<PlayerJoinEvent>();
  private readonly onPlayerLeave = new Event<PlayerLeaveEvent>();
  private readonly onPlayerEvent = new Event<PlayerEvent>();

  public get GameCreated() {
    return this.onCreateGame.expose();
  }

  public get GameDeleted() {
    return this.onDeleteGame.expose();
  }

  public get PlayerJoin() {
    return this.onPlayerJoin.expose();
  }

  public get PlayerLeave() {
    return this.onPlayerLeave.expose();
  }

  public get PlayerEvent() {
    return this.onPlayerEvent.expose();
  }
}
