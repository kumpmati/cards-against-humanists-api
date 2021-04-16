import * as admin from "firebase-admin";
import { Config } from "../../config/config";
import { AnswerCard, Card, CardPack, QuestionCard } from "../../game/types";
import { isAnswerCard, createCardPack } from "../../util";
import {
  DBChangeEvent,
  DBConnector,
  DBConnectorRequest,
  FirestoreCardPack,
} from "../types";

/**
 * Firebase DBConnector.
 * Reads and writes card data to Firestore.
 */
export class FirebaseConnector implements DBConnector {
  private app: admin.app.App;
  private firestore: FirebaseFirestore.Firestore;

  private listeners: any[];

  /**
   * Initializes Firebase and connects to Firestore.
   */
  async init(config: Config) {
    console.log("[Firebase] - Initializing...");

    this.listeners = [];

    const credentials = JSON.parse(process.env.FB_CREDENTIALS);
    this.app = admin.initializeApp(
      {
        credential: admin.credential.cert(credentials),
        databaseURL: config.db,
      },
      "db"
    );

    this.firestore = this.app.firestore();
    console.log("[Firebase] - Initialized");
  }

  /**
   * Returns all cards
   * @param opts
   * @returns
   */
  async get<T extends Card>(opts: DBConnectorRequest): Promise<T[]> {
    this.verifyIsInitialized();

    const collection = opts.type === "answer" ? "/answers" : "/questions";
    const data = await this.firestore
      .collection(collection)
      .where("pack", "in", opts.packs)
      .get();

    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as T[];
  }

  /**
   * Fetches all cards in database
   */
  async getAll(): Promise<CardPack[]> {
    console.log("[Firebase] - Loading all cards...");
    this.verifyIsInitialized();

    const query = await this.firestore
      .collection("/packs")
      .withConverter(cardPackConverter)
      .get();

    const docs = query.docs.map((doc) => doc.data());
    const packs = [];

    for await (const doc of docs) {
      const pack = createCardPack(doc);

      const answers = await this.get<AnswerCard>({
        type: "answer",
        packs: [doc.value],
      });

      const questions = await this.get<QuestionCard>({
        type: "question",
        packs: [doc.value],
      });

      pack.answers = answers;
      pack.questions = questions;
      packs.push(pack);
    }

    return packs;
  }

  /**
   * Pushes a card to Firestore in the appropriate collection based on card type.
   * @param card
   * @returns ID of the new document in Firestore
   */
  async add(card: Card): Promise<string> {
    const path = isAnswerCard(card) ? "/answers" : "/questions";
    const collection = this.firestore.collection(path);

    return (await collection.add(card)).id;
  }

  /**
   * TODO: attachListeners
   */
  async attachListeners(onChange: (e: DBChangeEvent<any>) => any) {
    console.log("[Firebase] - Attaching listeners...");

    const detachAnswerListener = this.firestore
      .collection("/answers")
      .onSnapshot((snapshot) => {
        for (const change of snapshot.docChanges()) {
          onChange({
            type: change.type,
            id: change.doc.id,
            payload: change.doc.data(),
          });
        }
      });

    const detachQuestionListener = this.firestore
      .collection("/questions")
      .onSnapshot((snapshot) => {
        for (const change of snapshot.docChanges()) {
          onChange({
            type: change.type,
            id: change.doc.id,
            payload: change.doc.data(),
          });
        }
      });

    this.listeners.push(detachAnswerListener, detachQuestionListener);

    console.log("[Firebase] - Listeners attached");
  }

  /**
   * TODO: detachListeners
   */
  async detachListeners() {
    for (const detach of this.listeners) {
      detach();
    }
  }

  /**
   * Disconnects from Firebase
   */
  async disconnect() {
    console.log("Disconnecting Firebase connector");

    await this.firestore.terminate();
    await this.app.delete();

    console.log("Disconnected");
  }

  /**
   * Checks if the app is initialized and throws an error if it's not
   */
  private verifyIsInitialized() {
    if (!this.app) throw new Error("Firebase not initialized");
    if (!this.firestore) throw new Error("Firestore not initialized");
  }
}
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

export const cardPackConverter = converter<FirestoreCardPack>();
