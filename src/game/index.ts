import { v4 } from "uuid";
import { Game, GameType } from "./types";

/**
 * Map of all active games.
 * Each game is stored using its ID as the key.
 */
const activeGames = new Map<string, Game>();

/**
 * Creates a new game, but does not start it.
 * @param opts Options required to create the game
 */
export const createGame = <T extends Game, O>(
  type: GameType<T, O>,
  opts: O
) => {
  let id = v4().substr(0, 4);
  if (activeGames.has(id)) id = v4().substr(0, 4);

  const game = new type(id, opts);
  activeGames.set(id, game);

  return game;
};

/**
 * Returns a game with the given ID, if it exists.
 * @param id Game ID
 * @throws Error if a game with that ID is not found
 */
export const getGame = (id: string) => {
  if (!activeGames.has(id)) throw new Error("Game not found");
  return activeGames.get(id);
};

export const gameExists = (id: string) => activeGames.has(id);

/**
 * Ends a game with the given ID, then deletes it from the Map of active games.
 * @param id Game ID
 */
export const deleteGame = (id: string) => {
  if (!activeGames.has(id)) throw new Error("Game not found");

  const game = activeGames.get(id);
  game.end();

  activeGames.delete(id);
};
