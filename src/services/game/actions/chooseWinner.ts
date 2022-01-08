import { ActionHandler, ChooseWinnerAction } from '@/types/game';

export const chooseWinnerHandler: ActionHandler<ChooseWinnerAction> = (game, payload, token) => {
  if (!isValid(payload)) throw new Error('invalid payload');

  return game.getState().state;
};

const isValid = (d: any): d is ChooseWinnerAction =>
  !!d &&
  typeof d === 'object' &&
  Object.prototype.hasOwnProperty.call(d, 'cards') &&
  Array.isArray(d.cards);
