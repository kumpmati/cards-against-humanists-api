import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { ClientGame, ClientPlayer, ServerSpectator } from './game';

export type InGameRequest<T> = {
  gameId: string;
  token: string;
  body: T;
};

export type SocketData = {
  userId: string;
  gameId: string;
  token: string;
};

/**
 * All events that the users can send to the server
 */
export interface ClientToServerEvents extends DefaultEventsMap {
  // outside game
  auth: (d: AuthRequestBody) => void;
  join: (d: PlayerJoinRequestBody) => void;
  joinSpectator: (d: SpectatorJoinRequestBody) => void;

  // ingame
  leave: (d: LeaveRequestBody) => void;
  submitAnswer: (d: SubmitAnswerRequestBody) => void;
  chooseWinner: (d: ChooseWinnerRequestBody) => void;
  getState: (d: GetStateRequestBody) => void;
}

/**
 * All the events that the server can send to the users
 */
export interface ServerToClientEvents extends DefaultEventsMap {
  // outside game
  auth: (d: AuthResponseBody) => void;
  join: (d: PlayerJoinResponseBody) => void;
  joinSpectator: (d: SpectatorJoinResponseBody) => void;

  // ingame
  leave: (d: LeaveResponseBody) => void;
  submitAnswer: (d: SubmitAnswerResponseBody) => void;
  chooseWinner: (d: ChooseWinnerResponseBody) => void;
  getState: (d: GetStateResponseBody) => void;
  stateChanged: (d: StateUpdateResponseBody) => void;
}

/**
 * Authentication
 */
export type AuthRequestBody = Partial<SocketData>;
export type AuthResponseBody = { success: boolean };

/**
 * Join game (player)
 */
export type PlayerJoinRequestBody = {
  gameId: string;
  type: 'player';
  password?: string;
  nickname: string;
};
export type PlayerJoinResponseBody = {
  gameId: string | null;
  player: ClientPlayer | null;
};

/**
 * Join game (spectator)
 */
export type SpectatorJoinRequestBody = {
  gameId: string;
  type: 'spectator';
  password?: string;
};
export type SpectatorJoinResponseBody = {
  gameId: string;
  spectator: ServerSpectator | null;
};

/**
 * Leave game
 */
export type LeaveRequestBody = Record<string, never>; // empty object
export type LeaveResponseBody = { success: boolean };

/**
 * Submit answer
 */
export type SubmitAnswerRequestBody = InGameRequest<{
  userId: string;
  cardId: string;
}>;
export type SubmitAnswerResponseBody = { success: boolean };

/**
 * Choose winner
 */
export type ChooseWinnerRequestBody = InGameRequest<{
  userId: string;
  cardId: string;
}>;
export type ChooseWinnerResponseBody = { success: boolean };

export type GetStateRequestBody = InGameRequest<{
  playerId: string;
  token: string;
}>;
export type GetStateResponseBody = InGameRequest<ClientGame>;

export type StateUpdateResponseBody = InGameRequest<ClientGame>;
