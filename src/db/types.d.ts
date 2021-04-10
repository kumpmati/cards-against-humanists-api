import { AnswerCard, QuestionCard } from "../game/types";

export type CardChangeEvent = FirebaseFirestore.DocumentChange<FirebaseFirestore.DocumentData>;

export interface LoadOpts {
  autoUpdate: boolean;
}

export interface LoadIntoMemoryOpts {
  answers: AnswerCard[];
  questions: QuestionCard[];
}
