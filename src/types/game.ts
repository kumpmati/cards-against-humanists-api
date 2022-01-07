import { AnswerCard, Card, QuestionCard } from './cards';

export type GameSettings = {
  name: string;
  password: string | null;
  host: string;
  cardPacks: string[];
  maxPoints: number;
  maxRounds: number;
  numCardsInHand: number;
};

export type Player = {
  id: string;
  token: string;
  nickname: string;
  score: number;
};

export type Spectator = {
  id: string;
};

export type GameState = {
  status: GameStateStatus;
  czar: string | null;
  round: number;
  roundEndTime: number;
  table: GameTable;
  hands: Record<string, Card[]>;
  deck: {
    answers: AnswerCard[];
    questions: QuestionCard[];
  };
};

export type GameTable = {
  question: QuestionCard | null;
  answers: AnswerCard[];
};

export type GameStateStatus =
  | 'IN_LOBBY'
  | 'GAME_START'
  | 'ROUND_START'
  | 'WAITING_FOR_ANSWERS'
  | 'WAITING_FOR_WINNER'
  | 'ROUND_END'
  | 'GAME_END';

export type Game = {
  id: string;
  host: string;
  players: Player[];
  spectators: Spectator[];
  state: GameState;
};

export type GameEvent =
  | 'GAME_STARTED'
  | 'GAME_ENDED'
  | 'PLAYER_JOINED'
  | 'PLAYER_LEFT'
  | 'CZAR_SELECTED'
  | 'ROUND_STARTED'
  | 'ROUND_ENDED'
  | 'QUESTION_CHANGED'
  | 'ANSWER_CARD_SUBMITTED'
  | 'ANSWER_CARDS_REVEALED'
  | 'WINNER_CHOSEN';
