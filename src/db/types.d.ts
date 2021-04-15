import { Config } from "../config/config";
import { AnswerCard, Card, CardPack, QuestionCard } from "../game/types";

/**
 * In-memory database that boardgame.io interfaces with.
 */
export interface IDatabase {
  init: (...args: any[]) => Promise<void>;
  get: <T extends Card>(opts: DBRequest) => T[];
  add: (card: Omit<Card, "id">) => Promise<string>;
}

export type DBRequest = {
  type: "answer" | "question";
  packs: string[];
};

/**
 * Connector to use in DB
 */
export interface DBConnector {
  init: (config: Config, ...args: any[]) => Promise<any>;
  get: <T extends Card>(opts: DBConnectorRequest) => Promise<T[]>;
  add: (card: Omit<Card, "id">) => Promise<string>;
  getAll: () => Promise<CardPack[]>;
  attachListeners: (...args: any[]) => Promise<any>;
  detachListeners: () => Promise<any>;
  disconnect: (...args: any) => Promise<any>;
}

export interface DBConnectorRequest {
  type: "question" | "answer";
  packs: string[];
}

// ----------- old -----------

export type ChangeEvent = FirebaseFirestore.DocumentChange<FirebaseFirestore.DocumentData>;
export type Snapshot<T> = FirebaseFirestore.QuerySnapshot<T>;

export interface GetCardsOpts<T extends Card> {
  type: CardTypeAsString<T>;
  n: number;
  packs: string[];
  startIndex: number;
  seed?: string;
}

type CardTypeAsString<T extends Card> = T extends QuestionCard
  ? "question"
  : "answer";

export interface GetCardsResult<T extends Card> {
  cards: T[];
  newIndex: number;
}

export interface FirestoreCardPack {
  text: string;
  value: string;
  editable: boolean;
}
