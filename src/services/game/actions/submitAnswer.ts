import { AnswerCard } from '@/types/cards';
import type { ActionHandler, SubmitAnswerAction } from '@/types/game';

export const submitAnswerHandler: ActionHandler<SubmitAnswerAction> = async (
  game,
  payload,
  token
) => {
  if (!isValid(payload)) throw new Error('invalid payload');

  const { players, state } = game.getState();

  // find player in game using token
  const player = players.find((p) => p.token === token);
  if (!player) {
    throw new Error('invalid token');
  }

  // check that player is not the czar
  if (state.czar === player.id) {
    throw new Error('czar cannot answer');
  }

  const playerHand = state.hands[player.id];

  // get all cards from hand that match an id in the payload
  const matchingCards = playerHand.filter((cardInHand) => payload.cards.includes(cardInHand.id));

  if (matchingCards.length !== payload.cards.length) {
    throw new Error('invalid card(s)');
  }

  if (state.table.answers[player.id]) {
    throw new Error('already answered');
  }

  // add cards to the table answers
  state.table.answers[player.id] = matchingCards;

  // remove added cards from player's hand
  state.hands[player.id] = playerHand.filter(
    (cardInHand) => !matchingCards.some((c) => c.id === cardInHand.id)
  );

  // get new cards from deck and add them to the player's hand
  const newCards = game.getAnswerCards(matchingCards.length);
  state.hands[player.id].push(...newCards);

  return state;
};

const isValid = (d: any): d is SubmitAnswerAction =>
  !!d &&
  typeof d === 'object' &&
  Object.prototype.hasOwnProperty.call(d, 'cards') &&
  Array.isArray(d.cards);
