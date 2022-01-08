import { GameController } from '@/services/game';
import { ChooseWinnerRequestBody, ChooseWinnerResponseBody, SocketData } from '@/types/socketio';
import { Socket } from 'socket.io';

/**
 * Handles the czar choosing the winner
 */
export const chooseWinnerHandler = async (
  req: ChooseWinnerRequestBody,
  socket: Socket<any, any, any, SocketData>
): Promise<ChooseWinnerResponseBody> => {
  return {
    success: false,
  };
};
