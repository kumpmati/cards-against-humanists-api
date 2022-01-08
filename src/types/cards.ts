type CardInterface<T extends string, O extends Record<string, any>> = O & {
  id: string;
  type: T;
  pack: string;
};

export type AnswerCard = CardInterface<
  'answer',
  {
    text: string;
  }
>;
export type QuestionCard = CardInterface<
  'question',
  {
    text: string;
    requiredCards: number;
  }
>;

export type Card = AnswerCard | QuestionCard;
