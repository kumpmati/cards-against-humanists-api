import { database } from '@/services/database';
import { SpectatorJoinRequestBody, SpectatorJoinResponseBody } from '@/types/socketio';

/**
 * Handles users joining a game as a spectator
 */
export const joinSpectatorHandler = async (
  req: SpectatorJoinRequestBody
): Promise<SpectatorJoinResponseBody> => {
  const game = await database.getGame(req.gameId);

  return {
    gameId: game.id,
    spectator: null,
  };
};
