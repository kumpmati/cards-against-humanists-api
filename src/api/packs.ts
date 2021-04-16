import { Server } from "boardgame.io";
import Router from "koa-router";
import { DB } from "../db";

/**
 * GET: /packs
 * Returns all the available cards packs
 * @param ctx
 */
export const getCardPacksHandler: Router.IMiddleware<
  any,
  Server.AppCtx
> = async (ctx) => {
  const response = DB.getCardPacks().map((pack) => {
    // destructure to avoid mutating the original pack
    const { questions, answers, ...rest } = pack;
    return { ...rest, questions: questions.length, answers: answers.length };
  });

  ctx.body = response;
};
