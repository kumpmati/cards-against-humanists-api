import { database } from '@/services/database';
import { AuthResponseBody, ChooseWinnerResponseBody, SocketData } from '@/types/socketio';
import { Socket } from 'socket.io';

/**
 * Handles the czar choosing the winner
 */
export const authHandler = async (
  body: Partial<SocketData>,
  socket: Socket<any, any, any, SocketData>
): Promise<AuthResponseBody> => {
  // set socket data
  socket.data.gameId = body.gameId;
  socket.data.token = body.token;
  socket.data.userId = body.userId;

  if (!body.gameId) return { success: false };

  const game = await database.getGame(body.gameId);
  if (!game) return { success: false };

  // TODO: check that body.token and body.userId is valid

  return { success: true };
};
