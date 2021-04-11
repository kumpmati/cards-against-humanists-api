import * as admin from "firebase-admin";
import { DEFAULT_CONFIG } from "../config";
import { Config } from "../config/config";
import { AnswerCard, Card, CardPack, QuestionCard } from "../game/types";
import {
  assignRandomID,
  cardIsAnswerCard,
  createCardPack,
  shuffle,
} from "../util";
import { dbHelpers } from "../util/db";
import { CardChangeEvent, GetCardsOpts, GetCardsResult } from "./types";

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

    await Promise.all([answersPromise, questionsPromise]).then(() => {
      const totalAnswers = Array.from(this.cardPacks.values()).reduce(
        (sum, curr) => sum + curr.answers.length,
        0
      );
      const totalQuestions = Array.from(this.cardPacks.values()).reduce(
        (sum, curr) => sum + curr.questions.length,
        0
      );
      console.log(
        "Loaded",
        totalAnswers,
        "answers and",
        totalQuestions,
        "questions"
      );
    });
  }

  /**
   * Applies a card change event to the in-memory DB
   */
  private processCardChange<T extends Card>(event: CardChangeEvent) {
    // use firebase document id as the card id so that
    // the cards can be queried easily in-memory as well
    const card = { ...event.doc.data(), id: event.doc.id } as T;

    if (!this.cardPacks.has(card.pack)) {
      this.cardPacks.set(card.pack, createCardPack(card.pack));
    }

    const pack = this.cardPacks.get(card.pack);
    const arr = (cardIsAnswerCard(card) ? pack.answers : pack.questions) as T[];

    switch (event.type) {
      case "added": {
        arr.push(card);
        console.log("[DB] - added", card);
        break;
      }

      case "modified": {
        // TODO: handle cases where card pack is changed
        const index = arr.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          console.log("[DB] - modified", arr[index], "to", card);
          arr[index] = card;
        }
        break;
      }

      case "removed": {
        const index = arr.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          console.log("[DB] - removed", card);
          arr.splice(index, 1);
        }
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
   * Returns an array of length n containing random cards from the given packs.
   * Each card has a randomly generated ID (generated each time)
   * @param opts {type, n, packs, startIndex = 0}
   * @returns {GetCardsResult}
   */
  getCards<T extends Card>({
    n,
    type,
    packs,
    startIndex = 0,
    seed,
  }: GetCardsOpts<T>): GetCardsResult<T> {
    const selector = type === "answer" ? "answers" : "questions";

    const unshuffledCards = packs
      .map((pack) => this.cardPacks.get(pack)[selector])
      .flat(1) as T[];

    // shuffle cards before iterating them to get a 'shuffled deck' effect
    const shuffledCards = shuffle(unshuffledCards, seed);

    const arr = [] as T[];

    for (let i = 0; i < n; i++) {
      const index = (startIndex + i) % shuffledCards.length;
      arr.push(shuffledCards[index]);
    }

    return {
      newIndex: startIndex + n,
      cards: arr.map(assignRandomID),
    };
  }
}

export const DB = new Database(DEFAULT_CONFIG);
