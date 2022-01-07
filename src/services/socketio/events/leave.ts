import { GameController } from '@/services/game';
import { LeaveRequestBody, LeaveResponseBody } from '@/types/socketio';

/**
 * Handles users leaving a game as a player or a spectator
 */
export const leaveHandler = async (
  req: LeaveRequestBody,
  game: GameController
): Promise<LeaveResponseBody> => {
  return {
    success: false,
  };
};
