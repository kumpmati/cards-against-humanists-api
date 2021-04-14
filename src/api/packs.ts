import { Server } from "boardgame.io";
import Router from "koa-router";
import { DB } from "../db";

type NewType = Server.AppCtx;

/**
 * Handles GET and POST requests to /cards
 * @param ctx
 */
export const apiCardPacksHandler: Router.IMiddleware<any, NewType> = async (
  ctx
) => {
  ctx.body = DB.getAvailableCardPacks();
};
