import { GameController } from '@/services/game';
import { SubmitAnswerRequestBody, SubmitAnswerResponseBody } from '@/types/socketio';

/**
 * Handles players submitting an answer
 */
export const submitAnswerHandler = async (
  req: SubmitAnswerRequestBody,
  game: GameController
): Promise<SubmitAnswerResponseBody> => {
  return {
    success: false,
  };
};
