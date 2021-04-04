import { Ctx } from "boardgame.io";

/**
 * Starts the game by going to the 'play' phase
 * @param G
 * @param ctx
 * @param args
 */
export const startGame = (G: any, ctx: Ctx) => {
  ctx.events.setPhase("play");
};
