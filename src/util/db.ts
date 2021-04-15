import { CardPack } from "../game/types";

export const getNumTotalCards = (cardPacks: Map<string, CardPack>) => {
  const answers = Array.from(cardPacks.values()).reduce(
    (sum, curr) => sum + curr.answers.length,
    0
  );
  const questions = Array.from(cardPacks.values()).reduce(
    (sum, curr) => sum + curr.questions.length,
    0
  );

  return { answers, questions, total: answers + questions };
};
