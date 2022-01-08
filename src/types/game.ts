import { AnswerCard, QuestionCard } from './cards';

export type GameSettings = {
  name: string;
  password: string | null;
  host: ServerPlayer;
  cardPacks: string[];
  maxPoints: number;
  maxRounds: number;
  numCardsInHand: number;
};

export type ServerPlayer = {
  id: string;
  token: string;
  nickname: string;
  score: number;
  status: 'connected' | 'disconnected';
};

export type ClientPlayer = {
  id: string;
  nickname: string;
  score: number;
  status: 'connected' | 'disconnected';
};

export type ServerSpectator = {
  id: string;
};

export type ClientGameState = Omit<ServerGameState, 'hands' | 'deck'> & {
  hand: AnswerCard[];
};

export type ServerGameState = {
  status: GameStateStatus;
  czar: string | null;
  round: number;
  roundStartTime: number;
  table: ServerGameTable;
  hands: Record<string, AnswerCard[]>;
};

export type ServerGameTable = {
  question: QuestionCard | null;
  answers: AnswerCard[];
};

export type ServerGame = {
  id: string;
  host: ServerPlayer;
  players: ServerPlayer[];
  spectators: ServerSpectator[];
  state: ServerGameState;
  deck: {
    answers: AnswerCard[];
    questions: QuestionCard[];
  };
};

export type ClientGame = {
  id: string;
  host: ClientPlayer;
  players: ServerPlayer[];
  spectators: ServerSpectator[];
  state: ClientGameState;
};

export type GameStateStatus =
  | 'IN_LOBBY'
  | 'GAME_START'
  | 'ROUND_START'
  | 'WAITING_FOR_ANSWERS'
  | 'WAITING_FOR_WINNER'
  | 'ROUND_END'
  | 'GAME_END';

export type GameEvent =
  | 'GAME_STARTED'
  | 'GAME_ENDED'
  | 'PLAYER_JOINED'
  | 'PLAYER_CONNECTED'
  | 'PLAYER_DISCONNECTED'
  | 'PLAYER_LEFT'
  | 'CZAR_SELECTED'
  | 'ROUND_STARTED'
  | 'ROUND_ENDED'
  | 'QUESTION_CHANGED'
  | 'ANSWER_CARD_SUBMITTED'
  | 'ANSWER_CARDS_REVEALED'
  | 'WINNER_CHOSEN'
  | 'HOST_CHANGED';
