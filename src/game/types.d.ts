import { PlayStages } from "./phases/play";

export type Card = QuestionCard | AnswerCard;

export interface QuestionCard {
  id?: string;
  text: string;
  required_cards: number;
  pack: string;
}

export interface AnswerCard {
  id?: string;
  owner?: string;
  text: string;
  pack: string;
}

export interface CardPack {
  name: string;
  questions: QuestionCard[];
  answers: AnswerCard[];
}

export type CahumG = {
  currentStage: PlayStages;
  table: {
    question: QuestionCard;
    answers: AnswerCard[];
    revealed: AnswerCard[];
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
