import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
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

  const cardsWithPlayerID = cards.map((card) => ({
    ...card,
    id: ctx.playerID,
  }));
  G.table.answers.push(cardsWithPlayerID);

  // filter out all cards that have been submitted
  const newHand = G.hands[ctx.playerID]?.filter(
    (c: AnswerCard) => !cards.find((card) => card.text === c.text)
  );

  G.hands[ctx.playerID] = newHand; // update player's hand
};

/**
 * Reveals an answer card.
 * Only the current Czar can make this move.
 * @param G
 * @param ctx
 * @param id
 */
export const revealCard = (G: CahumG, ctx: Ctx, id: string) => {
  console.log("revealCard:", id);
};

/**
 * Chooses the winning player for the round.
 * Only the current Czar can make this move.
 * @param G
 * @param ctx
 * @param id
 */
export const submitWinner = (G: CahumG, ctx: Ctx, id: string) => {
  if (typeof id !== "string") return INVALID_MOVE;

  // TODO: error handling and giving a point to the player

  ctx.events.endTurn(); // move to next round
};
