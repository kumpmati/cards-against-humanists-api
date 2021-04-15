import * as admin from "firebase-admin";
import { DEFAULT_CONFIG } from "../config";
import { Config } from "../config/config";
import { AnswerCard, Card, CardPack, QuestionCard } from "../game/types";
import {
  assignRandomID,
  cardIsAnswerCard,
  cardIsQuestionCard,
  createCardPack,
  isCard,
  shuffle,
} from "../util";
import { dbHelpers, getNumTotalCards } from "../util/db";
import { loadCardsFromDisk } from "./disk";
import {
  ChangeEvent,
  CardTypeAsString,
  GetCardsOpts,
  GetCardsResult,
  FirestoreCardPack,
  Snapshot,
} from "./types";

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

  async loadFromDisk(path: string) {
    console.log("Loading cards from disk:", path);

    const contents = await loadCardsFromDisk(path);
    for (const pack of contents) {
      this.cardPacks.set(pack.code, pack);
    }

    this.printTotalCards();
  }

  /**
   * Loads all cards into memory from the database.
   * Listens to real-time updates from firestore and updates in-memory db to match
   */
  async load() {
    console.log("Loading card packs from Firestore");

    // load card packs before cards
    await new Promise<void>((resolve) => {
      this.db.packs.onSnapshot((snapshot) => {
        snapshot
          .docChanges()
          .forEach((change: ChangeEvent) => this.onCardPackChange(change));
        resolve();
      });
    });

    const answersPromise = new Promise<void>((resolve) => {
      this.db.answers.onSnapshot((snapshot) => {
        snapshot
          .docChanges()
          .forEach((change) => this.onCardChange<AnswerCard>(change));
        resolve();
      });
    });

    const questionsPromise = new Promise<void>((resolve) => {
      this.db.questions.onSnapshot((snapshot: Snapshot<QuestionCard>) => {
        snapshot
          .docChanges()
          .forEach((change) => this.onCardChange<QuestionCard>(change));
        resolve();
      });
    });

    await Promise.all([answersPromise, questionsPromise]).then(() => {
      this.printTotalCards();
    });
  }

  /**
   * Handles card pack change events coming from firestore
   * @param event
   */
  private onCardPackChange(event: ChangeEvent) {
    const doc = event.doc.data() as FirestoreCardPack;

    switch (event.type) {
      case "added":
        if (!this.cardPacks.has(doc.value)) {
          this.cardPacks.set(
            doc.value,
            createCardPack(doc.text, doc.value, doc.editable)
          );
        } else console.log("duplicate card pack:", doc.value);
        break;

      case "removed":
        this.cardPacks.delete(doc.value);
        break;
    }
  }

  /**
   * Handles card change events coming from firestore
   */
  private onCardChange<T extends Card>(event: ChangeEvent) {
    // use firebase document id as the card id so that
    // the cards can be queried easily in-memory as well
    const card = { ...event.doc.data(), id: event.doc.id } as T;

    if (!this.cardPacks.has(card.pack)) {
      console.warn("card pack", card.pack, "does not exist! card id:", card.id);
      return;
    }

    const pack = this.cardPacks.get(card.pack);
    const arr = (cardIsAnswerCard(card) ? pack.answers : pack.questions) as T[];

    switch (event.type) {
      case "added": {
        arr.push(card);
        break;
      }

      case "modified": {
        // TODO: handle cases where card pack is changed
        const index = arr.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          arr[index] = card;
        }
        break;
      }

      case "removed": {
        const index = arr.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          arr.splice(index, 1);
        }
      }
    }
  }

  /**
   * Returns an array containing the names of every available card pack
   */
  getAvailableCardPacks(): Omit<CardPack, "questions" | "answers">[] {
    return Array.from(this.cardPacks.values()).map((pack) => {
      const { questions, answers, ...rest } = pack; // strip away questions and answers
      return rest;
    });
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

  getCardPack(code: string) {
    return this.cardPacks.get(code);
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

    if (!this.checkCardPacksExist(packs)) {
      console.warn("One of these packs does not exist:", packs);
      return null;
    }

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

  /**
   * Adds a card to the database.
   * Validates the card before sending it to firestore.
   * @returns ID of the newly created card
   */
  async addCard(card: Omit<Card, "id">): Promise<string> {
    if (!isCard(card)) throw new Error("Invalid card");

    if (cardIsAnswerCard(card)) {
      const ref = await this.db.answers.add(card);
      return ref.id;
    } else if (cardIsQuestionCard(card)) {
      const ref = await this.db.questions.add(card);
      return ref.id;
    }
  }

  /**
   * Removes a card from the database
   * @param card
   */
  async removeCard<T extends Card>(
    id: string,
    type: CardTypeAsString<T>
  ): Promise<any> {
    try {
      if (type === "answer") {
        await this.db.answers.doc(id).delete();
      } else if (type === "question") {
        await this.db.questions.doc(id).delete();
      }
    } catch (e) {
      console.warn(e);
    }
  }

  private printTotalCards() {
    const total = getNumTotalCards(this.cardPacks);
    console.log(total.answers, "answers and", total.questions, "questions");
  }
}

export const DB = new Database(DEFAULT_CONFIG);
