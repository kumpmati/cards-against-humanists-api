import { Router } from 'express';
import { createGameHandler } from './game/create';
import { deleteGameHandler } from './game/delete';
import { getGameHandler } from './game/get';
import { joinGameHandler } from './game/join';

export const apiRouter = Router();

apiRouter.post('/game/create', createGameHandler);
apiRouter.get('/game/:gameId', getGameHandler);
apiRouter.post('/game/:gameId/join', joinGameHandler);
//apiRouter.delete('/game/:gameId/delete', deleteGameHandler);
