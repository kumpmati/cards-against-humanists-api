import { CardPack } from "../types";

/**
 * Database class, responsible for providing cards to games
 */
class Database {
  private cards: Map<string, CardPack>;

  constructor() {
    console.log("Database initialized");
  }

  /**
   * Loads all cards into memory from the database.
   */
  async load() {
    console.log("Loading cards...");
    // TODO: fetch cards from DB
  }

  /**
   * Returns all cards in the given packs as a flattened array
   * @param packs
   */
  getCards(packs: string[]) {
    return packs.map(this.cards.get);
  }
}

export const DB = new Database();
