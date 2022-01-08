import { ActionHandler, RevealCardAction } from '@/types/game';

export const revealCardHandler: ActionHandler<RevealCardAction> = (game, payload, token) => {
  if (!isValid(payload)) throw new Error('invalid payload');

  return game.getState().state;
};

const isValid = (d: any): d is RevealCardAction =>
  !!d &&
  typeof d === 'object' &&
  Object.prototype.hasOwnProperty.call(d, 'cards') &&
  Array.isArray(d.cards);
