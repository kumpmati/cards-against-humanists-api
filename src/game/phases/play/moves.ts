import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { findCard } from "../../../util";
import { AnswerCard, CahumG } from "../../types";

/**
 * Used to submit an answer of 1 or more cards.
 * Can be called once by each player per round.
 * @param G
 * @param ctx
 * @param args
 */
export const submitAnswer = (G: CahumG, ctx: Ctx, cards: AnswerCard[]) => {
  const requiredCards = G.table.question?.required_cards;
  if (!Array.isArray(cards) || cards.length !== requiredCards) {
    return INVALID_MOVE;
  }

  // set playerID as the owner of the cards
  const cardsWithOwner = cards.map((card) => ({
    ...card,
    owner: ctx.playerID,
  }));

  G.table.answers.push(cardsWithOwner);

  // remove all submitted cards from hand
  const newHand = G.hands[ctx.playerID]?.filter(
    (c: AnswerCard) => !findCard(c, cards)
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
export const revealCard = (G: CahumG, ctx: Ctx, card: AnswerCard) => {
  for (const arr of G.table.answers) {
    const answer = findCard(card, arr);
    if (!answer) continue;

    const alreadyRevealed = findCard(answer, G.table.revealed);
    if (alreadyRevealed) return INVALID_MOVE;

    G.table.revealed.push(answer);
    return;
  }

  return INVALID_MOVE;
};

/**
 * Chooses the winning player for the round.
 * Only the current Czar can make this move.
 * @param G
 * @param ctx
 * @param cardID
 */
export const chooseWinner = (G: CahumG, ctx: Ctx, ownerID: string) => {
  if (typeof ownerID !== "string") return INVALID_MOVE;

  const player = G.table.answers.find((a) => a[0].owner === ownerID);
  if (!player) return INVALID_MOVE;

  if (!G.points[ownerID]) G.points[ownerID] = 0;
  G.points[ownerID] += 1;

  // move to next round and set the winner as the next czar
  ctx.events.endTurn({ next: ownerID });
};
