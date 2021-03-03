import { v4 } from "uuid";
import { gameExists } from "../game";
import { AuthToken } from "./types";

/**
 * Maps an auth token to a game ID
 * e.g. auth token a1513-as41 gives access to game with id 5c2a
 */
const authTokens = new Map<string, string>();

/**
 * Creates an unique token to be used as authentication when joining a game.
 * The game associated with the gameID must be an active game.
 * @param gameID ID of game the token is associated with
 */
export const createAuthToken = (gameID: string): AuthToken => {
  if (!gameExists(gameID)) throw new Error("Game not found");

  const token = v4();
  authTokens.set(token, gameID);

  return { gameID, token };
};

/**
 * Updates the game of an existing auth token
 * @param token Token
 * @param gameID ID of the game to associate token with
 */
export const updateAuthToken = (token: string, gameID: string): AuthToken => {
  if (!gameExists(gameID)) throw new Error("Game not found");
  if (!authTokens.has(token)) return createAuthToken(gameID);

  authTokens.set(token, gameID);

  return { gameID, token };
};

/**
 * Deletes a token from the list of valid auth tokens
 * @param token Token
 */
export const deleteAuthToken = (token: string) => authTokens.delete(token);

/**
 * Checks if an auth token matches a game ID
 * @param token
 * @param gameID
 * @param deleteIfValid Deletes the token if it is valid
 */
export const validate = (token: AuthToken, deleteIfValid?: boolean) => {
  const isValid = token.gameID === authTokens.get(token.token);

  if (deleteIfValid) deleteAuthToken(token.token);
  return isValid;
};

export const isAuthToken = (o: any): o is AuthToken => {
  return (
    o != null &&
    o.hasOwnProperty("gameID") &&
    typeof o.gameID === "string" &&
    o.hasOwnProperty("token") &&
    typeof o.token === "string"
  );
};
