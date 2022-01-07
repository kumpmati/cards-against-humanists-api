import { database } from '@/services/database';
import { GameController } from '@/services/game';
import {
  ClientToServerEvents,
  Request,
  RequestToResponseMap,
  Response,
  ServerToClientEvents,
  SocketData,
} from '@/types/socketio';
import { Socket } from 'socket.io';

/**
 * Helpful wrapper for handling requests from users that are not in a game.
 * The return value of `handler` is emitted back to the user surrounded in a response object.
 */
export const handleRequest = <
  EventType extends keyof ClientToServerEvents,
  ReqBody,
  ResBody extends RequestToResponseMap[EventType]
>(
  socket: Socket,
  handler: (body: ReqBody, socket: Socket) => Promise<ResBody>
) => {
  return async (req: Request<EventType, ReqBody>) => {
    if (!isRequest(req)) throw new Error('malformed request');

    const response: Omit<Response<EventType, ResBody>, 'gameId'> = {
      requestId: req.requestId,
      type: req.type,
      body: await handler(req.body, socket),
    };

    // send response to socket
    socket.emit(req.type, response);
  };
};

/**
 * Helpful wrapper for handling requests from players ingame.
 * The return value of `handler` is emitted back to the user surrounded in a response object.
 */
export const handleGameRequest = <
  EventType extends keyof ClientToServerEvents,
  ReqBody,
  ResBody extends RequestToResponseMap[EventType]
>(
  socket: Socket,
  handler: (body: ReqBody, game: GameController, socket: Socket) => Promise<ResBody>
) => {
  return async (req: Request<EventType, ReqBody>) => {
    if (!isGameRequest(req)) throw new Error('malformed game request');

    const game = await database.getGame(req.gameId);
    if (!game) throw new Error('game not found');

    const response: Response<EventType, ResBody> = {
      requestId: req.requestId,
      type: req.type,
      gameId: game.id,
      body: await handler(req.body, game, socket),
    };

    // send response to socket
    socket.emit(req.type, response);
  };
};

const isRequest = (v: unknown): v is Omit<Request<any, any>, 'gameId'> =>
  !!v &&
  v instanceof Object &&
  Object.prototype.hasOwnProperty.call(v, 'requestId') &&
  Object.prototype.hasOwnProperty.call(v, 'type') &&
  Object.prototype.hasOwnProperty.call(v, 'body');

const isGameRequest = (v: unknown): v is Request<any, any> =>
  !!v &&
  v instanceof Object &&
  Object.prototype.hasOwnProperty.call(v, 'requestId') &&
  Object.prototype.hasOwnProperty.call(v, 'type') &&
  Object.prototype.hasOwnProperty.call(v, 'gameId') &&
  Object.prototype.hasOwnProperty.call(v, 'body');
