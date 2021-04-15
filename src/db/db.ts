import { Config } from "../config/config";
import { Card, CardPack } from "../game/types";
import { assignRandomID, isCard, shuffle } from "../util";
import { getNumTotalCards } from "../util/db";
import { DB, DBConnector, DBRequest, DBResponse } from "./types";

/**
 * Stores card data in-memory.
 * Uses a connector fetch the data from any source.
 * (Also because boardgame.io doesn't allow async functions)
 */
class Database implements DB {
  private connector: DBConnector;
  private cardPacks: Map<string, CardPack>;

  constructor(connector: DBConnector) {
    this.connector = connector;
    this.cardPacks = new Map();
  }

  /**
   * Loads all cards using the connector.
   */
  async init(config: Config): Promise<void> {
    console.log("Initializing Database");

    // initialize connector first
    await this.connector.init(config);

    const packs = await this.connector.getAll();
    for (const pack of packs) {
      this.cardPacks.set(pack.code, pack);
    }

    const total = getNumTotalCards(this.cardPacks);
    console.log(`Loaded ${total.total} cards `);

    console.log("Database initialized");
  }

  /**
   * Retrieves cards from memory.
   * @param opts
   */
  get<T extends Card>(opts: DBRequest): DBResponse<T> {
    if (!this.cardPacksExist(opts.packs)) {
      throw new Error("Card pack does not exist");
    }

    const selector = opts.type === "answer" ? "answers" : "questions";

    const unshuffled = opts.packs
      .map((code) => this.cardPacks.get(code)?.[selector])
      .flat(1) as T[];

    const shuffled = shuffle(unshuffled, opts.seed);

    const cards = [] as T[];
    for (let i = 0; i < opts.n; i++) {
      const index = (opts.startIndex + i) % shuffled.length;
      cards.push(shuffled[index]);
    }

    return {
      newIndex: opts.startIndex + cards.length,
      cards: cards.map(assignRandomID),
    };
  }

  async add(card: Omit<Card, "id">) {
    if (!isCard(card)) throw new Error("Not a card");
    return await this.connector.add(card);
  }

  /**
   * Returns true if every given pack exists in-memory
   * @param code
   * @returns
   */
  private cardPacksExist(packs: string[]) {
    return packs.every((p) => this.cardPacks.has(p));
  }
}

export default Database;
