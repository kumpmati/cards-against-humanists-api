import { AnswerCard, Card, QuestionCard } from "../game/types";

export type CardChangeEvent = FirebaseFirestore.DocumentChange<FirebaseFirestore.DocumentData>;

export interface GetCardsOpts<T extends Card> {
  type: CardTypeAsString<T>;
  n: number;
  packs: string[];
  startIndex: number;
}

type CardTypeAsString<T extends Card> = T extends QuestionCard
  ? "question"
  : "answer";

export interface GetCardsResult<T extends Card> {
  cards: T[];
  newIndex: number;
}
