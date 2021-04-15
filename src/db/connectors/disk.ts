import { readFile } from "fs/promises";
import { Config } from "../../config/config";
import { Card, CardPack } from "../../game/types";
import { DBConnector, DBConnectorRequest } from "../types";

export const loadCardsFromDisk = async (path: string) => {
  const rawData = (await readFile(path)).toString();
  const data = JSON.parse(rawData);

  if (!data.packs)
    throw new Error(
      "Invalid file format. JSON should contain key 'packs' of type CardPack[]"
    );
  return data.packs as CardPack[];
};

/**
 * Disk DBConnector.
 * Writes and reads card data from disk.
 */
export class DiskConnector implements DBConnector {
  private path: string;

  async init(config: Config) {
    console.log("[Disk] - Initializing...");

    this.path = process.env.JSON_DB_PATH ?? "./dev/cards.json";

    console.log("[Disk] - Initialized");
  }

  async get<T extends Card>(opts: DBConnectorRequest): Promise<T[]> {
    return [];
  }

  /**
   * TODO: add
   * Writes a card to the disk
   * @param card
   * @returns
   */
  async add(card: Omit<Card, "id">): Promise<string> {
    return null;
  }

  /**
   * Returns all the card packs on disk
   * @returns
   */
  async getAll(): Promise<CardPack[]> {
    const rawData = (await readFile(this.path)).toString();
    const data = JSON.parse(rawData);

    if (!data.packs)
      throw new Error(
        "Invalid file format. JSON should contain key 'packs' of type CardPack[]"
      );

    return data.packs as CardPack[];
  }

  /**
   * TODO: attachListeners
   */
  async attachListeners(...args: any[]) {}

  /**
   * TODO: detachListeners
   */
  async detachListeners() {}

  /**
   * TODO: disconnect
   */
  async disconnect() {}
}
