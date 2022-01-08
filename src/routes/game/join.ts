import { database } from '@/services/database';
import { User } from '@/types/user';
import { RequestHandler } from 'express';

/**
 * Route: POST `/api/game/:gameId/join`
 */
export const joinGameHandler: RequestHandler = async (req, res) => {
  const { gameId } = req.params;
  const { nickname } = req.body as User; // TODO: validate body

  const game = await database.getGame(gameId);
  if (!game) {
    return res.status(404).json({ error: 404, message: 'game not found' });
  }

  const player = game.addPlayer(nickname);
  if (!player) {
    return res.status(400).json({ error: 400, message: 'nickname already exists' });
  }

  return res.status(201).json({
    game: game.getPlayerState(player.id),
    player,
  });
};
