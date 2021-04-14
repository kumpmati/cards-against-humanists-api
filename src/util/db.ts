import { firestore } from "firebase-admin";
import { AnswerCard, QuestionCard } from "../game/types";

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
