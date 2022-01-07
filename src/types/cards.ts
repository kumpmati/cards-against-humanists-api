type CardInterface<T extends string, O extends Record<string, any>> = O & {
  id: string;
  type: T;
  pack: string;
};

export type AnswerCard = CardInterface<'answer', {}>;
export type QuestionCard = CardInterface<'question', {}>;

export type Card = AnswerCard | QuestionCard;
