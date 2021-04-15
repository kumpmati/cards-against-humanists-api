import { firestore } from "firebase-admin";
import { AnswerCard, CardPack, QuestionCard } from "../game/types";

/**
 * Helper function to access Firestore more easily and with type safety.
 * @param db
 * @returns
 */
export const dbHelpers = (db: firestore.Firestore) => ({
  answers: db.collection("/answers").withConverter(answerCardConverter),
  questions: db.collection("/questions").withConverter(questionCardConverter),
  packs: db.collection("/packs").withConverter(cardPackConverter),
});

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const questionCardConverter = converter<QuestionCard>();
const answerCardConverter = converter<AnswerCard>();
const cardPackConverter = converter<any>();

/**
 * Returns the total number of cards in the database as an object
 * @param cardPacks
 */
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
