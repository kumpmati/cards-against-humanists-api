import { Server } from "boardgame.io";
import Router from "koa-router";
import { DB } from "../db/db";
import { CardPack } from "../game/types";
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

  if (!DB.cardPacksExist([card.pack])) {
    ctx.status = 400;
    ctx.body = "Card pack does not exist";
    return;
  }

  const pack = DB.getCardPacks().find((p) => p.code === card.pack);
  if (!pack.editable) {
    ctx.status = 400;
    ctx.body = "Cannot add card to non-editable pack";
    return;
  }

  const cardID = await DB.add(ctx.request.body);
  ctx.body = cardID;
};

/**
 * Returns all the cards in the given card packs
 * @param ctx
 * @returns
 */
export const getCardsHandler: Router.IMiddleware<any, Server.AppCtx> = async (
  ctx
) => {
  let queryPacks = ctx.query?.["packs"];
  if (!queryPacks) {
    ctx.status = 400;
    return;
  }

  if (queryPacks === "all")
    queryPacks = DB.getCardPacks().map((p: CardPack) => p.code);

  if (!Array.isArray(queryPacks)) queryPacks = [queryPacks];

  ctx.body = {
    packs: DB.getCardPacks().filter((pack) => queryPacks.includes(pack.code)),
  };
};
