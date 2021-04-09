import * as admin from "firebase-admin";
import { DEFAULT_CONFIG } from "../config";
import { Config } from "../config/config";
import { AnswerCard, CardPack, QuestionCard } from "../game/types";
import { shuffle } from "../helpers";
import { dbHelpers } from "../helpers/db";

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
      credential: admin.credential.applicationDefault(),
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

    const answers = (await this.db.answers.get()).docs.map((d) => d.data());
    const questions = (await this.db.questions.get()).docs.map((d) => d.data());

    for (const card of answers) {
      if (!this.cardPacks.has(card.pack)) {
        this.cardPacks.set(card.pack, createCardPack(card.pack));
      }

      this.cardPacks.get(card.pack).answers.push(card);
    }

    for (const card of questions) {
      if (!this.cardPacks.has(card.pack)) {
        this.cardPacks.set(card.pack, createCardPack(card.pack));
      }

      this.cardPacks.get(card.pack).questions.push(card);
    }

    console.log("Cards loaded");
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
   * Returns all answer and question cards of the given packs
   * in an object with two fields: answers and questions.
   *
   * @param packs
   */
  getCards(packs: string[]) {
    const answers = [] as AnswerCard[];
    const questions = [] as QuestionCard[];

    for (const name of packs) {
      if (!this.cardPacks.has(name)) throw new Error("Card pack not found");
      const pack = this.cardPacks.get(name);

      answers.push(...pack.answers);
      questions.push(...pack.questions);
    }

    return {
      answers,
      questions,
    };
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
