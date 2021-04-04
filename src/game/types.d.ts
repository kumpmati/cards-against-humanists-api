export type Card = QuestionCard | AnswerCard;

export interface QuestionCard {
  text: string;
  required_cards: number;
  author?: string;
}

export interface AnswerCard {
  text: string;
  author?: string;
}

export interface CardPack {
  name: string;
  language: "fi" | "en";
  questions: QuestionCard[];
  answers: AnswerCard[];
}
