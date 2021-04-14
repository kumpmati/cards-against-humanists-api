import { PlayStages } from "./phases/play";

export type Card = QuestionCard | AnswerCard;

export interface QuestionCard {
  id: string;
  text: string;
  required_cards: number;
  pack: string;
  extra?: Record<string, any>;
}

export interface AnswerCard {
  id: string;
  owner?: string;
  text: string;
  pack: string;
  extra?: Record<string, any>;
}

export interface CardPack {
  name: string;
  code: string;
  questions: QuestionCard[];
  answers: AnswerCard[];
}

export type CahumG = {
  table: {
    question: QuestionCard;
    answers: AnswerCard[][];
    revealed: AnswerCard[];
  };
  points: Record<string, number>;
  hands: Record<string, AnswerCard[]>;
  state: {
    round: number;
    stage: PlayStages;
  };
  settings: SetupData;
  db: {
    answerDeckIndex: number;
    questionDeckIndex: number;
    seed: string;
  };
};

export interface CahumGClient extends Omit<CahumG, "hands" | "db"> {
  hand: AnswerCard[];
}

export interface SetupData {
  numPlayers: number;
  private: boolean;
  czarReveals: boolean;
  shuffleAnswers: boolean;
  packs: string[];
}
