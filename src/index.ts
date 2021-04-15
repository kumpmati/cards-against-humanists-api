import { Server } from "boardgame.io/server";
import { v4 } from "uuid";
import { Cahum } from "./game";
import { DEFAULT_CONFIG } from "./config";
import { getCardsHandler, newCardHandler } from "./api/cards";
import bodyparser from "koa-bodyparser";
import { DB } from "./db";
import { apiCardPacksHandler } from "./api/packs";

const uuid = () => v4().slice(0, 5);

const start = async () => {
  if (DEFAULT_CONFIG.dev) {
    await DB.loadFromDisk("./dev/cards.json");
  } else {
    await DB.load();
  }
  //await DB.load(); // load db before starting server

  const server = Server({
    games: [Cahum],
    uuid,
  });

  server.router.post("/cards/new", bodyparser(), newCardHandler);
  server.router.get("/cards", getCardsHandler);
  server.router.get("/packs", apiCardPacksHandler);
  server.run(DEFAULT_CONFIG.port);
};

start();
