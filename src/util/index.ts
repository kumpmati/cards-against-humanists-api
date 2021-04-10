import { v4 } from "uuid";
import { AnswerCard, QuestionCard } from "../game/types";

/**
 * Returns a shuffled copy of the given array
 * @param arr
 * @returns
 */
export const shuffle = <T>(arr: T[]) => {
  const copy = arr.slice(0);

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

/**
 * Assigns a random ID to a card.
 * @param card
 * @returns
 */
export const assignRandomID = <T extends AnswerCard | QuestionCard>(
  card: T
): T => ({ ...card, id: v4() });

/**
 * Finds an answer card in an array based on its id and owner
 * @param card
 * @param arr
 * @returns
 */
export const findCard = (card: AnswerCard, arr: AnswerCard[]) =>
  arr.find((c) => c.id === card.id && c.owner === card.owner);
