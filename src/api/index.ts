import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import { getCardsHandler, newCardHandler } from "./cards";
import { getCardPacksHandler } from "./packs";
import { Server } from "boardgame.io";

export const attachApiRoutes = (router: Router<any, Server.AppCtx>) => {
  router.post("/cards/new", bodyparser(), newCardHandler);
  router.get("/cards", getCardsHandler);
  router.get("/packs", getCardPacksHandler);
};
