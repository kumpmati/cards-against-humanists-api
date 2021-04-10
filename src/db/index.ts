import * as admin from "firebase-admin";
import { DEFAULT_CONFIG } from "../config";
import { Config } from "../config/config";
import { AnswerCard, Card, CardPack, QuestionCard } from "../game/types";
import { shuffle } from "../util";
import { dbHelpers } from "../util/db";
import { CardChangeEvent, LoadIntoMemoryOpts } from "./types";

/**
 * Database class, responsible for providing cards to games
 */
class Database {
  private app: admin.app.App;
  private _firestore: FirebaseFirestore.Firestore;
  private db;

  private cardPacks: Map<string, CardPack>;

  constructor(config: Config) {
    this.cardPacks = new Map();

    this.app = admin.initializeApp({
      credential: admin.credential.cert(config.firebase),
      databaseURL: config.db,
    });

    this._firestore = this.app.firestore();
    this.db = dbHelpers(this._firestore);
  }

  /**
   * Loads all cards into memory from the database.
   */
  async load() {
    console.log("Loading cards");

    const answersPromise = new Promise<void>((resolve) => {
      this.db.answers.onSnapshot((snapshot) => {
        snapshot
          .docChanges()
          .forEach((change) => this.processCardChange<AnswerCard>(change));
        resolve();
      });
    });

    const questionsPromise = new Promise<void>((resolve) => {
      this.db.questions.onSnapshot((snapshot) => {
        snapshot
          .docChanges()
          .forEach((change) => this.processCardChange<QuestionCard>(change));
        resolve();
      });
    });

    await Promise.all([answersPromise, questionsPromise]);
    console.log("Cards loaded");
  }

  /**
   * Applies a card change event to the in-memory DB
   */
  private processCardChange<T extends Card>(event: CardChangeEvent) {
    const card = { ...event.doc.data(), id: event.doc.id } as T;

    if (!this.cardPacks.has(card.pack)) {
      this.cardPacks.set(card.pack, createCardPack(card.pack));
    }

    const pack = this.cardPacks.get(card.pack);
    const arr = (cardIsAnswerCard(card) ? pack.answers : pack.questions) as T[];

    switch (event.type) {
      case "added": {
        arr.push(card);
        break;
      }

      case "modified": {
        const index = arr.findIndex((c) => c.id === card.id);
        if (index !== -1) arr[index] = card;
        break;
      }

      case "removed": {
        const index = arr.findIndex((c) => c.id === card.id);
        if (index !== -1) arr.splice(index, 1);
      }
    }
  }

  /**
   * Returns an array containing the names of every available card pack
   */
  getAvailableCardPacks() {
    return Array.from(this.cardPacks.keys());
  }

  /**
   * Checks that all given card packs exist
   * @param packs
   */
  checkCardPacksExist(packs: string[]): boolean {
    for (const pack of packs) {
      if (!this.cardPacks.has(pack)) return false;
    }
    return true;
  }

  /**
   * Returns an array of length n containing random answer cards from the given packs
   * @param num
   * @param packs
   */
  getAnswerCards(n: number, packs: string[]) {
    const cards = packs.map((pack) => this.cardPacks.get(pack).answers).flat(1);
    return shuffle(cards).slice(0, n);
  }

  /**
   * Returns an array of length n containing random answer cards from the given packs
   * @param num
   * @param packs
   */
  getQuestionCards(n: number, packs: string[]) {
    const cards = packs
      .map((pack) => this.cardPacks.get(pack).questions)
      .flat(1);
    return shuffle(cards).slice(0, n);
  }
}

export const DB = new Database(DEFAULT_CONFIG);

const createCardPack = (name: string): CardPack => ({
  name,
  answers: [] as AnswerCard[],
  questions: [] as QuestionCard[],
});

const cardIsAnswerCard = (card: Card): card is AnswerCard =>
  !card.hasOwnProperty("required_cards");
