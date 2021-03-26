import { Ctx } from "boardgame.io";

export const startGame = (G: any, ctx: Ctx, ...args: any[]) => {
  ctx.events.setPhase("play");
};

export const submitCard = (G: any, ctx: Ctx, ...args: any[]) => {};

export const pickWinnerCard = (G: any, ctx: Ctx, ...args: any[]) => {};
