import { ClientToServerEvents, ServerToClientEvents, SocketData } from '@/types/socketio';
import { handleSocketRequest } from '@/utils/socketio';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { database } from '../database';
import { leaveHandler } from './events/leave';
import { actionHandler } from './events/action';

/**
 * Initializes the Socket.IO server
 */
export const initSocketIO = (http: HttpServer) => {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(http, {
    cors: {
      origin: ['http://localhost:3000'],
    },
  });

  /**
   * When user joins, make sure they provide valid game id and token
   */
  io.use(async (socket, next) => {
    const { gameId, token } = socket.handshake.auth;

    const gameController = await database.getGame(gameId);
    if (!gameController) {
      return next(new Error('game not found'));
    }

    // find player associated with the token
    const player = gameController.authenticatePlayer(token);
    if (!player) {
      return next(new Error('no player matching token'));
    }

    // set socket data
    socket.data.gameId = gameId;
    socket.data.token = token;
    socket.data.userId = player.id;

    next();
  });

  io.on('connection', async (socket) => {
    const { gameId, userId, token } = socket.data;

    // get instance of game that user is in
    const game = await database.getGame(socket.data.gameId!);
    if (!game) {
      console.error('game not found when socket connected');
      return;
    }

    // notify game that the player is connected
    game.setPlayerStatus(userId!, 'connected');

    // subscribe socket to get game updates
    const unsubscribe = game.subscribe(userId!, (state) => {
      socket.emit('stateChanged', {
        gameId: gameId!,
        token: token!,
        body: state,
      });
    });

    /**
     * Ingame requests
     */
    handleSocketRequest(socket, game, 'action', actionHandler);
    handleSocketRequest(socket, game, 'leave', leaveHandler);

    /**
     * Player authentication failed
     */
    socket.on('connect_error', (err) => {
      console.log('connection error:', err);
    });

    /**
     * Player disconnected
     */
    socket.on('disconnect', () => {
      game.setPlayerStatus(userId!, 'disconnected');
      unsubscribe(); // remove event listener
    });
  });
};
