import { GameController } from '@/services/game';
import { LeaveRequestBody, LeaveResponseBody, SocketData } from '@/types/socketio';
import { Socket } from 'socket.io';

/**
 * Handles users leaving a game as a player or a spectator
 */
export const leaveHandler = async (
  req: LeaveRequestBody,
  socket: Socket<any, any, any, SocketData>
): Promise<LeaveResponseBody> => {
  return {
    success: false,
  };
};
