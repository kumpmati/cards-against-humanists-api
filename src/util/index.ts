import { v4 } from "uuid";
import { AnswerCard, Card, CardPack, QuestionCard } from "../game/types";
import RND from "seedrandom";
import { FirestoreCardPack } from "../db/types";

export const intoArray = <T>(src: any): T[] =>
  Array.isArray(src) ? src : [src];

/**
 * Returns a shuffled copy of the given array
 * @param arr
 * @returns
 */
export const shuffle = <T>(arr: T[], seed?: string) => {
  const random = RND(seed ?? "cahum");

  const copy = arr.slice(0);

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
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

export const createCardPack = (pack: FirestoreCardPack): CardPack => ({
  name: pack.text,
  code: pack.value,
  editable: pack.editable,
  answers: [],
  questions: [],
});

export const isCard = (card: any): card is Card =>
  typeof card === "object" &&
  card.hasOwnProperty("pack") &&
  typeof card.pack === "string" &&
  card.hasOwnProperty("text") &&
  typeof card.text === "string";

export const isAnswerCard = (card: Card): card is AnswerCard =>
  isCard(card) && !card.hasOwnProperty("required_cards");

export const isQuestionCard = (card: Card): card is QuestionCard =>
  isCard(card) && card.hasOwnProperty("required_cards");
