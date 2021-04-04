import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayStages } from ".";

import { AnswerCard, CahumG } from "../../types";

/**
 * Used to submit an answer of 1 or more cards.
 * Can be called once by each player per round.
 * @param G
 * @param ctx
 * @param args
 */
export const submitAnswer = (G: CahumG, ctx: Ctx, cards: AnswerCard[]) => {
  if (!Array.isArray(cards)) return INVALID_MOVE;

  ctx.events.setStage(PlayStages.waitForOthers); // wait for other players
};

/**
 * Used to pick a winner among submitted cards.
 * The winner will get 1 point.
 * Can be called once per round.
 * @param G
 * @param ctx
 * @param args
 */
export const chooseWinner = (G: CahumG, ctx: Ctx, ...args: any[]) => {
  console.log(G, ctx, "|", args);
};
