import { database } from '@/services/database';
import { RequestHandler } from 'express';

/**
 * Route: GET `/api/game/:gameId`
 */
export const getGameHandler: RequestHandler = async (req, res) => {
  const { gameId } = req.params;

  const game = await database.getGame(gameId);
  if (!game) {
    return res.status(404).json({ error: 404, message: 'game not found' });
  }

  return res.status(200).json(game.getInfo());
};
