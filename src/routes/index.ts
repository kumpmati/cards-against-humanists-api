import { Router } from 'express';
import { createGameHandler } from './game/create';
import { deleteGameHandler } from './game/delete';

const apiRouter = Router();

apiRouter.post('/game/create', createGameHandler);
apiRouter.delete('/game/:id/delete', deleteGameHandler);
