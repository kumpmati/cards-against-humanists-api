import { AnswerCard, QuestionCard } from "../game/types";
import { FirestoreCardPack } from "./types";

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

export const questionCardConverter = converter<QuestionCard>();
export const answerCardConverter = converter<AnswerCard>();
export const cardPackConverter = converter<FirestoreCardPack>();
