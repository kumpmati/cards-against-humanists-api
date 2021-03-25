import { Server } from "boardgame.io/server";
import { v4 } from "uuid";
import { DEFAULT_CONFIG } from "../OLD/config";
import { Cahum } from "./game";

const server = Server({
  games: [Cahum],
  uuid: () => v4().slice(0, 5),
});
server.run(DEFAULT_CONFIG.port);
