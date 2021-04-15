import { Card, QuestionCard } from "../game/types";

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
