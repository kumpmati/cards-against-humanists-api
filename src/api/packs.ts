import { Server } from "boardgame.io";
import Router from "koa-router";
import { DB } from "../db";

type NewType = Server.AppCtx;

/**
 * Handles GET requests to /cards.
 * Returns all the available cards packs
 * @param ctx
 */
export const getCardPacksHandler: Router.IMiddleware<any, NewType> = async (
  ctx
) => {
  ctx.body = DB.getAvailableCardPacks();
};
