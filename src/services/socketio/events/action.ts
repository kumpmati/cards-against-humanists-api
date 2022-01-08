import { GameController } from '@/services/game';
import { Action, ActionEvent, SocketData } from '@/types/socketio';
import { Socket } from 'socket.io';

/**
 * Handles players submitting an answer
 */
export const actionHandler = async (
  req: Action<ActionEvent, any>,
  socket: Socket<any, any, any, SocketData>,
  game: GameController
): Promise<any> => {
  // delegate to game instance's action handlers
  const success = await game.action(req.event, req.body, socket.data.token!);

  return {
    success,
  };
};
