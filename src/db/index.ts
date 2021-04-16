import { Config } from "../config/config";
import { Card, CardPack } from "../game/types";
import { isCard } from "../util";
import { getNumTotalCards } from "../util/db";
import { DBConnector, DBRequest, IDatabase } from "./types";

/**
 * Stores card data in memory. (Because boardgame.io doesn't allow async fetching)
 * Uses a connector fetch the data from an arbitrary source.
 */
class Database implements IDatabase {
  private connector: DBConnector;
  private cardPacks: Map<string, CardPack>;

  constructor() {
    this.cardPacks = new Map();
  }

  /**
   * Sets the connector to use. Replaces old connector.
   * @param connector DBConnector
   */
  use(connector: DBConnector) {
    this.connector = connector;
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
   * Called in boardgame.io when players are given new cards or a new question.
   * @param opts
   */
  get<T extends Card>(opts: DBRequest): T[] {
    if (!this.cardPacksExist(opts.packs)) {
      throw new Error("Card pack does not exist");
    }

    // get cards from all the given packs and flatten them to a 1d array
    const cards = opts.packs
      .map((code) => this.cardPacks.get(code)?.[opts.type])
      .flat(1) as T[];

    return cards;
  }

  /**
   * Inserts a card into the database
   * @param card
   * @returns
   */
  async add(card: Omit<Card, "id">) {
    if (!isCard(card)) throw new Error("Not a card");
    // TODO: also add into memory
    return await this.connector.add(card);
  }

  /**
   * Returns true if every given pack exists in-memory
   * @param code
   * @returns
   */
  cardPacksExist(packs: string[]) {
    return packs.every((p) => this.cardPacks.has(p));
  }

  /**
   * Returns all card packs in memory
   * @returns
   */
  getCardPacks() {
    return Array.from(this.cardPacks.values());
  }

  /**
   * Returns a single card pack from memory
   * @param code
   * @returns
   */
  getCardPack(code: string) {
    return this.cardPacks.get(code);
  }
}

export const DB = new Database();
