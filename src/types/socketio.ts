import { Player, Spectator } from './game';

/**
 * Request and Response
 */
export type Request<EventType extends keyof ClientToServerEvents, Body> = {
  requestId: string;
  type: EventType;
  gameId: string;
  body: Body;
};
export type Response<EventType extends keyof ServerToClientEvents, Body> = {
  requestId: string;
  type: EventType;
  gameId: string;
  body: Body;
};

export type SocketData = {
  userId: string;
  gameId: string;
  token: string;
};

/**
 * All events that the users can send to the server
 */
export type ClientToServerEvents = {
  // outside game
  auth: (d: Request<'auth', AuthRequestBody>) => void;
  join: (d: Request<'join', PlayerJoinRequestBody>) => void;
  joinSpectator: (d: Request<'joinSpectator', SpectatorJoinRequestBody>) => void;

  // ingame
  leave: (d: Request<'leave', LeaveRequestBody>) => void;
  submitAnswer: (d: Request<'submitAnswer', SubmitAnswerRequestBody>) => void;
  chooseWinner: (d: Request<'chooseWinner', ChooseWinnerRequestBody>) => void;
};

/**
 * All the events that the server can send to the users
 */
export type ServerToClientEvents = {
  // outside game
  auth: (d: Response<'auth', AuthResponseBody>) => void;
  join: (d: Response<'join', PlayerJoinResponseBody>) => void;
  joinSpectator: (d: Response<'joinSpectator', SpectatorJoinResponseBody>) => void;

  // ingame
  leave: (d: Response<'leave', LeaveResponseBody>) => void;
  submitAnswer: (d: Response<'submitAnswer', SubmitAnswerResponseBody>) => void;
  chooseWinner: (d: Response<'chooseWinner', ChooseWinnerResponseBody>) => void;
};

/**
 * Maps the `ClientToServerEvents` keys to a response type
 */
export type RequestToResponseMap = {
  auth: AuthResponseBody;
  join: PlayerJoinResponseBody;
  joinSpectator: SpectatorJoinResponseBody;
  leave: LeaveResponseBody;
  submitAnswer: SubmitAnswerResponseBody;
  chooseWinner: ChooseWinnerResponseBody;
};

/**
 * Authentication
 */
export type AuthRequestBody = Partial<SocketData>;
export type AuthResponseBody = {
  success: boolean;
};

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
  player: Player | null;
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
  spectator: Spectator | null;
};

/**
 * Leave game
 */
export type LeaveRequestBody = {};
export type LeaveResponseBody = {
  success: boolean;
};

/**
 * Submit answer
 */
export type SubmitAnswerRequestBody = {
  userId: string;
  cardId: string;
};
export type SubmitAnswerResponseBody = {
  success: boolean;
};

/**
 * Choose winner
 */
export type ChooseWinnerRequestBody = {
  userId: string;
  cardId: string;
};
export type ChooseWinnerResponseBody = {
  success: boolean;
};
