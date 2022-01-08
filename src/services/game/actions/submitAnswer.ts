import type { ActionHandler, SubmitAnswerAction } from '@/types/game';
import { gotoPhase } from '@/utils/game';

export const submitAnswerHandler: ActionHandler<SubmitAnswerAction> = async (
  game,
  payload,
  token
) => {
  if (!isValid(payload)) throw new Error('invalid payload');

  const { players, state } = game.getState();

  // check that game is in correct phase before processing
  if (state.phase !== 'WAITING_FOR_ANSWERS') {
    throw new Error('not accepting answers');
  }

  // find player using token
  const player = players.find((p) => p.token === token);
  if (!player) {
    throw new Error('invalid token');
  }

  // check that player is not the czar
  if (state.czar === player.id) {
    throw new Error('czar cannot answer');
  }

  const playerHand = state.hands?.[player.id] ?? [];

  // get all cards from hand that match an id in the payload
  const matchingCards = playerHand.filter((cardInHand) => payload.cards.includes(cardInHand.id));

  // check that all submitted cards are valid
  if (matchingCards.length !== payload.cards.length) {
    throw new Error('invalid card(s)');
  }

  // check that player has not answered yet
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

  const remainingPlayers = players.filter(
    // get all players that are not the czar and have not submitted yet
    (p) => p.id !== state.czar && !state.table.answers?.[p.id]
  );

  // still waiting on other players, do nothing else
  if (remainingPlayers.length) return state;

  // ---------------------------
  // all players have submitted, advance game state
  // ---------------------------
  gotoPhase(state, 'REVEALING_CARDS');

  return state;
};

const isValid = (d: any): d is SubmitAnswerAction =>
  !!d &&
  typeof d === 'object' &&
  Object.prototype.hasOwnProperty.call(d, 'cards') &&
  Array.isArray(d.cards);
