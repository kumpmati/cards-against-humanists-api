import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';

/**
 * Route: POST `/api/game/create`
 */
export const createGameHandler: RequestHandler = async (req, res) => {
  const settings = req.body;

  const id = randomUUID();

  return res.status(500).end('not implemented');
};
