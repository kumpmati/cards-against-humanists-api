import { Server } from "boardgame.io/server";
import { v4 } from "uuid";

import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";
import { apiCardsHandler } from "./api/cards";
import bodyparser from "koa-bodyparser";
import { DB } from "./db";

const start = async () => {
  await DB.load(); // load db before starting server

  const server = Server({
    games: [Cahum],
    uuid: () => v4().slice(0, 5),
  });

  server.router.post("/cards", bodyparser(), apiCardsHandler);

  server.run(DEFAULT_CONFIG.port);
};

start();
