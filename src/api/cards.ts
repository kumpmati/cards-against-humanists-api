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
    ctx.body = "Card is malformed";
    return;
  }

  const card = ctx.request.body;

  if (!DB.checkCardPacksExist([card.pack])) {
    ctx.status = 400;
    ctx.body = "Card pack does not exist";
    return;
  }

  const pack = DB.getAvailableCardPacks().find((p) => p.code === card.pack);
  if (!pack.editable) {
    ctx.status = 400;
    ctx.body = "Cannot add card to non-editable pack";
    return;
  }

  const cardID = await DB.addCard(ctx.request.body);
  ctx.body = cardID;
};

export const getCardsHandler: Router.IMiddleware<any, Server.AppCtx> = async (
  ctx
) => {
  let queryPacks = ctx.query?.["packs"];
  if (!queryPacks) {
    ctx.status = 400;
    return;
  }

  if (queryPacks === "all")
    queryPacks = DB.getAvailableCardPacks().map((p) => p.code);

  if (!Array.isArray(queryPacks)) queryPacks = [queryPacks];

  const packsExist = DB.checkCardPacksExist(queryPacks);
  if (!packsExist) {
    ctx.status = 404;
    return;
  }

  const packs = queryPacks.map((code) => DB.getCardPack(code));
  ctx.body = {
    packs,
  };
};
