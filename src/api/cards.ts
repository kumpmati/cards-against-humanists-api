import { Server } from "boardgame.io";
import Router from "koa-router";
import { DB } from "../db";
import { isCard } from "../util";

/**
 * Handles GET and POST requests to /cards
 * @param ctx
 */
export const apiCardsHandler: Router.IMiddleware<any, Server.AppCtx> = async (
  ctx
) => {
  if (!isCard(ctx.request.body)) {
    ctx.status = 400;
    return;
  }

  if (!DB.checkCardPacksExist([ctx.request.body.pack])) {
    ctx.status = 400;
    return;
  }

  const cardID = await DB.addCard(ctx.request.body);
  ctx.body = cardID;
};
