export type Card = QuestionCard | AnswerCard;

export interface QuestionCard {
  id?: string;
  text: string;
  required_cards: number;
  pack: string;
}

export interface AnswerCard {
  id?: string;
  text: string;
  pack: string;
}

export interface CardPack {
  name: string;
  questions: QuestionCard[];
  answers: AnswerCard[];
}

export type CahumG = {
  table: {
    question: QuestionCard;
    answers: AnswerCard[][];
    revealed: string[];
  };
  hands: Record<string, AnswerCard[]>;
  settings: SetupData;
};

export interface SetupData {
  packs: string[];
  password?: string;
  maxPlayers: number;
  shuffleAnswers: boolean;
  czarReveals: boolean;
}
