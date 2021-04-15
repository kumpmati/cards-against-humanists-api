import { Server } from "boardgame.io";
import Router from "koa-router";
import { DB } from "../db";

/**
 * URL: /packs
 * Returns all the available cards packs
 * @param ctx
 */
export const getCardPacksHandler: Router.IMiddleware<
  any,
  Server.AppCtx
> = async (ctx) => {
  ctx.body = DB.getCardPacks().map((pack) => {
    const { questions, answers, ...rest } = pack;
    return rest;
  });
};
