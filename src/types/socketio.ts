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
export interface ClientToServerEvents {
  // outside game
  auth: (d: AuthRequestBody) => void;
  join: (d: PlayerJoinRequestBody) => void;
  joinSpectator: (d: SpectatorJoinRequestBody) => void;

  // ingame
  leave: (d: LeaveRequestBody) => void;
  action: <E extends ActionEvent, B>(d: Action<E, B>) => void;

  // socket.io's own events
  connect_error: (d: string) => void;
}

/**
 * All the events that the server can send to the users
 */
export interface ServerToClientEvents {
  // outside game
  auth: (d: AuthResponseBody) => void;
  join: (d: PlayerJoinResponseBody) => void;
  joinSpectator: (d: SpectatorJoinResponseBody) => void;

  // ingame
  leave: (d: LeaveResponseBody) => void;
  action: <E extends ActionEvent, B>(d: Action<E, B>) => void;
  stateChanged: (d: StateUpdateBody) => void;
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
 * State update
 */
export type StateUpdateBody = InGameRequest<ClientGame>;

/**
 * Action
 */
export type Action<EventType extends ActionEvent, B extends any> = {
  event: EventType;
  body: B;
};

export type ActionEvent = 'submitAnswer' | 'chooseWinner' | 'revealCard';
