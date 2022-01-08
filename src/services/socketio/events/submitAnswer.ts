import { database } from '@/services/database';
import { SocketData, SubmitAnswerRequestBody, SubmitAnswerResponseBody } from '@/types/socketio';
import { Socket } from 'socket.io';

/**
 * Handles players submitting an answer
 */
export const submitAnswerHandler = async (
  req: SubmitAnswerRequestBody,
  socket: Socket<any, any, any, SocketData>
): Promise<SubmitAnswerResponseBody> => {
  const game = await database.getGame(req.gameId);

  return {
    success: false,
  };
};
