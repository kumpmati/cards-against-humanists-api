import * as admin from "firebase-admin";
import { Config } from "../config/config";
import { AnswerCard, Card, CardPack, QuestionCard } from "../game/types";
import { cardIsAnswerCard, cardIsQuestionCard, isCard } from "../util";
import { createCardPack2 } from "../util/db";
import { cardPackConverter } from "./converters";
import { DBConnector, DBConnectorReq } from "./types";

/**
 * Firebase DBConnector
 */
export class FirebaseConnector implements DBConnector {
  private app: admin.app.App;
  private firestore: FirebaseFirestore.Firestore;

  /**
   * Initializes Firebase and connects to Firestore.
   */
  async init(config: Config) {
    console.log("Initializing Firebase connector");

    this.app = admin.initializeApp(
      {
        credential: admin.credential.cert(config.firebase),
        databaseURL: config.db,
      },
      "db"
    );

    this.firestore = this.app.firestore();
    console.log("Initialized");
  }

  /**
   * Disconnects from Firebase
   */
  async detach() {
    console.log("Disconnecting Firebase connector");

    await this.firestore.terminate();
    await this.app.delete();

    console.log("Disconnected");
  }

  /**
   * Queries cards from firestore
   * @param opts
   * @returns
   */
  async get<T extends Card>(opts: DBConnectorReq): Promise<T[]> {
    this.verifyIsInitialized();

    const collection = opts.type === "answer" ? "/answers" : "/questions";
    const data = await this.firestore
      .collection(collection)
      .where("pack", "in", opts.packs)
      .limit(1)
      .get();

    return data.docs.map((card) => card.data()) as T[];
  }

  /**
   * Fetches all cards in database
   */
  async getAll(): Promise<CardPack[]> {
    this.verifyIsInitialized();

    const query = await this.firestore
      .collection("/packs")
      .withConverter(cardPackConverter)
      .get();

    const docs = query.docs.map((doc) => doc.data());
    const packs = [];

    for await (const doc of docs) {
      const pack = createCardPack2(doc);

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
    const path = cardIsAnswerCard(card) ? "/answers" : "/questions";
    const collection = this.firestore.collection(path);

    return (await collection.add(card)).id;
  }

  async onChange(): Promise<any> {
    this.verifyIsInitialized();
    throw new Error("onChange unimplemented");
  }

  /**
   * Checks if the app is initialized and throws an error if it's not
   */
  private verifyIsInitialized() {
    if (!this.app) throw new Error("Firebase not initialized");
    if (!this.firestore) throw new Error("Firestore not initialized");
  }
}
