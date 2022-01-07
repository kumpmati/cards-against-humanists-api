import { database } from '@/services/database';
import { PlayerJoinRequestBody, PlayerJoinResponseBody } from '@/types/socketio';
import { Socket } from 'socket.io';

/**
 * Handles users joining a game as a player
 */
export const joinHandler = async (
  req: PlayerJoinRequestBody,
  socket: Socket
): Promise<PlayerJoinResponseBody> => {
  const game = await database.getGame(req.gameId);

  if (!game) {
    return {
      gameId: null,
      player: null,
    };
  }

  // attempt to add player to the game
  const player = game.addPlayer(req.password, req.nickname);
  if (!player) {
    return {
      gameId: game.id,
      player: null,
    };
  }

  // make the user join a room with the game's id.
  // this way sending data to all players in a game is easier.
  socket.join(game.id);

  return {
    gameId: game.id,
    player,
  };
};
