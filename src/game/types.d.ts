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
  table: {
    question: QuestionCard;
    answers: AnswerCard[];
    revealed: AnswerCard[];
  };
  points: Record<string, number>;
  hands: Record<string, AnswerCard[]>;
  state: {
    round: number;
    stage: PlayStages;
  };
  settings: SetupData;
};

export interface CahumGClient extends Omit<CahumG, "hands"> {
  hand: AnswerCard[];
}

export interface SetupData {
  numPlayers: number;
  password: string;
  czarReveals: boolean;
  shuffleAnswers: boolean;
  packs: string[];
}
