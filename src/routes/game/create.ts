import { database } from '@/services/database';
import { GameSettings } from '@/types/game';
import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';

/**
 * Route: POST `/api/game/create`
 */
export const createGameHandler: RequestHandler = async (req, res) => {
  const settings = req.body as GameSettings;

  // create unique game ID of length 5
  const id = randomUUID().substring(0, 5);

  const game = await database.createGame(id, settings);
  if (!game) {
    return res.status(500).json({ error: 500, message: 'failed to create game' });
  }

  const player = game.addPlayer(settings.host.nickname)!; // cannot fail since host is first to be added

  // set the player as the host of the game
  game.setHost(player);

  return res.status(201).json({
    game: game.getPlayerState(player.id),
    player,
  });
};
