import { Ctx } from "boardgame.io";

export const startGame = (G: any, ctx: Ctx, ...args: any[]) => {
  ctx.events.setPhase("play");
};
