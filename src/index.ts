import { Server } from "boardgame.io/server";
import { v4 } from "uuid";
import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";
import { DB } from "./db";
import { attachApiRoutes } from "./api";

const uuid = () => v4().slice(0, 5);

const start = async () => {
  if (DEFAULT_CONFIG.dev) {
    await DB.loadFromDisk("./dev/cards.json");
  } else {
    await DB.load();
  }

  const server = Server({
    games: [Cahum],
    uuid,
  });

  attachApiRoutes(server.router);
  server.run(DEFAULT_CONFIG.port);
};

start();
