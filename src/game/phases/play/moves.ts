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

  cards.forEach((card, i) => {
    G.table.answers.push({
      ...card,
      id: `${ctx.playerID}-${i}`,
      owner: ctx.playerID,
    });
  });

  // remove all submitted cards from hand
  const newHand = G.hands[ctx.playerID]?.filter(
    (c: AnswerCard) => !cards.find((card) => card.text === c.text)
  );

  G.hands[ctx.playerID] = newHand;
};

/**
 * Reveals an answer card.
 * Only the current Czar can make this move.
 * @param G
 * @param ctx
 * @param id
 */
export const revealCard = (G: CahumG, ctx: Ctx, id: string) => {
  const card = G.table.answers.find((c) => c.id === id);
  if (!card) return INVALID_MOVE;

  const alreadyRevealed = G.table.revealed.find((c) => c.id === id);
  if (alreadyRevealed) return INVALID_MOVE;

  G.table.revealed.push(card);
};

/**
 * Chooses the winning player for the round.
 * Only the current Czar can make this move.
 * @param G
 * @param ctx
 * @param id
 */
export const chooseWinner = (G: CahumG, ctx: Ctx, id: string) => {
  if (typeof id !== "string") return INVALID_MOVE;

  const winningPlayerID = G.table.answers.find((card) => card.id === id)?.owner;
  if (!winningPlayerID) return INVALID_MOVE;

  if (!G.points[winningPlayerID]) G.points[winningPlayerID] = 0;
  G.points[winningPlayerID] += 1;

  ctx.events.endTurn(); // move to next round
};
