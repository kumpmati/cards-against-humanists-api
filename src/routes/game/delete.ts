import { database } from '@/services/database';
import { RequestHandler } from 'express';

type Params = {
  gameId: string;
};

/**
 * Route: DELETE `/api/game/:gameId`
 */
export const deleteGameHandler: RequestHandler<Params> = async (req, res) => {
  const { gameId } = req.params;

  const success = await database.deleteGame(gameId);
  if (!success) {
    return res.status(404).json({ error: 404, message: 'game not found' });
  }

  return res.status(200).end('game deleted');
};
