export type Card = QuestionCard | AnswerCard;

export interface QuestionCard {
  text: string;
  required_cards: number;
  pack: string;
}

export interface AnswerCard {
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
  };
  hands: Record<string, any[]>;
  packs: string[];
};

export interface SetupData {
  packs: string[];
  password?: string;
  maxPlayers: number;
  shuffleAnswers: boolean;
  czarReveals: boolean;
}
