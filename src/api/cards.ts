import { Server } from "boardgame.io";
import Router from "koa-router";
import { DB } from "../db";
import { isCard } from "../util";

/**
 * Handles POST requests to /cards/new
 * @param ctx
 */
export const newCardHandler: Router.IMiddleware<any, Server.AppCtx> = async (
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

export const getCardsHandler: Router.IMiddleware<any, Server.AppCtx> = async (
  ctx
) => {
  let queryPacks = ctx.query?.["packs"];
  if (!Array.isArray(queryPacks)) queryPacks = [queryPacks];
  if (!queryPacks) {
    ctx.status = 400;
    return;
  }

  const packsExist = DB.checkCardPacksExist(queryPacks);
  if (!packsExist) {
    ctx.status = 404;
    return;
  }

  const packs = queryPacks.map((code) => DB.getCardPack(code));
  const response = {
    packs,
  };
  ctx.body = response;
};
