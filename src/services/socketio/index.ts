import { ClientToServerEvents, ServerToClientEvents, SocketData } from '@/types/socketio';
import { handleGameRequest, handleRequest } from '@/utils/socketio';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { authHandler } from './events/auth';
import { chooseWinnerHandler } from './events/chooseWinner';
import { joinHandler } from './events/join';
import { joinSpectatorHandler } from './events/joinSpectator';
import { leaveHandler } from './events/leave';
import { submitAnswerHandler } from './events/submitAnswer';

/**
 * Initializes the Socket.IO server
 */
export const initSocketIO = (http: HttpServer) => {
  const server = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(
    http
  );

  server.on('connection', (s) => {
    /**
     * Requests that can be made outside a game
     */
    s.on('auth', handleRequest(s, authHandler));
    s.on('join', handleRequest(s, joinHandler));
    s.on('joinSpectator', handleRequest(s, joinSpectatorHandler));

    /**
     * Ingame requests
     */
    s.on('leave', handleGameRequest(s, leaveHandler));
    s.on('submitAnswer', handleGameRequest(s, submitAnswerHandler));
    s.on('chooseWinner', handleGameRequest(s, chooseWinnerHandler));

    /**
     * Disconnect
     */
    s.on('disconnect', (s) => {
      console.log('disconnected:', s);
    });
  });
};
