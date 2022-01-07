import { GameController } from '@/services/game';
import { ChooseWinnerRequestBody, ChooseWinnerResponseBody } from '@/types/socketio';

/**
 * Handles the czar choosing the winner
 */
export const chooseWinnerHandler = async (
  req: ChooseWinnerRequestBody,
  game: GameController
): Promise<ChooseWinnerResponseBody> => {
  return {
    success: false,
  };
};
