import { Ctx } from "boardgame.io";

/**
 * Used to submit an answer of 1 or more cards.
 * Can be called once by each player per round.
 * @param G
 * @param ctx
 * @param args
 */
export const submitAnswer = (G: any, ctx: Ctx, ...args: any[]) => {};

/**
 * Used to pick a winner among submitted cards.
 * The winner will get 1 point.
 * Can be called once per round.
 * @param G
 * @param ctx
 * @param args
 */
export const chooseWinner = (G: any, ctx: Ctx, ...args: any[]) => {};
