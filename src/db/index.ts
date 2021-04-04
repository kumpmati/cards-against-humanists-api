import * as admin from "firebase-admin";
import { DEFAULT_CONFIG } from "../config";
import { Config } from "../config/config";
import { Card, CardPack } from "../game/types";
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
    console.log("Loading cards...");

    const packs = (await this.db.packs.get()).docs.map((d) => d.data());
    packs.forEach((pack) => {
      this.cardPacks.set(pack.name, pack);
    });
  }

  getCards(packs: string[]) {
    const cards = packs.map((name) => this.cardPacks.get(name));

    return {
      answers: cards.map((pack) => pack.answers).flat(1),
      questions: cards.map((pack) => pack.questions).flat(1),
    };
  }
}

export const DB = new Database(DEFAULT_CONFIG);
