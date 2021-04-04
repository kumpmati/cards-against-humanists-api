import { firestore } from "firebase-admin";
import { AnswerCard, CardPack, QuestionCard } from "../game/types";

export const dbHelpers = (db: firestore.Firestore) => ({
  packs: db.collection("/packs").withConverter(cardPackConverter),
  answers: db.collection("/answers").withConverter(answerCardConverter),
  questions: db.collection("/questions").withConverter(questionCardConverter),
});

/**
 * Helper function to set types to retrieved documents
 * @returns
 */
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

export const questionCardConverter = converter<QuestionCard>();
export const answerCardConverter = converter<AnswerCard>();
export const cardPackConverter = converter<CardPack>();
