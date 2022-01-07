import { RequestHandler } from 'express';

type Params = {
  id: string;
};

/**
 * Route: DELETE `/api/game/:id`
 */
export const deleteGameHandler: RequestHandler<Params> = async (req, res) => {
  const { id } = req.params;

  return res.status(500).end('not implemented');
};
